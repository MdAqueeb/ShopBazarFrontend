# webhooks/inventory_webhook.py
# Event-driven trigger: fires when a large order depletes stock.
# Usage: python webhooks/inventory_webhook.py
# Expose this endpoint to your OMS via ngrok or your production domain.

import os
from datetime import datetime

from flask import Flask, jsonify, request

from agents.inventory.agent import run_inventory_agent
from agents.inventory.prompts import WEBHOOK_PROMPT

app = Flask(__name__)

# Simple shared-secret auth — set WEBHOOK_SECRET in your .env
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")


def _is_authorized(req) -> bool:
    """Validate the incoming webhook using a shared secret header."""
    if not WEBHOOK_SECRET:
        return True  # secret not configured — allow all (dev only)
    return req.headers.get("X-Webhook-Secret") == WEBHOOK_SECRET


@app.route("/webhooks/inventory/order-fulfilled", methods=["POST"])
def order_fulfilled():
    if not _is_authorized(request):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "Empty payload"}), 400

    sku_id = data.get("sku_id")
    units_sold = data.get("units_sold")
    current_qty = data.get("current_qty")

    if current_qty is None or current_qty > 50:
        # Only trigger the agent for meaningful stock impact
        return jsonify({"triggered": False, "reason": "stock above threshold"}), 200

    prompt = WEBHOOK_PROMPT.format(
        sku_id=sku_id,
        units_sold=units_sold,
        current_qty=current_qty,
    )

    run_id = f"webhook-{sku_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    result = run_inventory_agent(prompt, run_id=run_id)

    return jsonify({"triggered": True, "run_id": run_id, "summary": result}), 200


if __name__ == "__main__":
    port = int(os.environ.get("WEBHOOK_PORT", 5001))
    app.run(port=port, debug=False)
