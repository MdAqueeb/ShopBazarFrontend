# agents/inventory/tools.py
# Replace each NotImplementedError stub with your actual DB/ERP/API calls.

import math
import os
from datetime import date
from typing import Optional


def get_stock_levels(
    sku_ids: Optional[list] = None,
    status_filter: str = "all",
    warehouse_id: Optional[str] = None,
) -> dict:
    """
    Connect to your inventory DB here.

    Expected return shape:
    {
        "items": [
            {
                "sku_id": "SKU-001",
                "product_name": "Blue Ceramic Mug",
                "qty": 45,
                "reorder_threshold": 50,
                "minimum_threshold": 20,
                "warehouse_id": "WH-MAIN",
                "days_of_stock_remaining": 9,
                "status": "low"
            },
            ...
        ],
        "total": 142,
        "as_of": "2025-08-01"
    }
    """
    # TODO: replace with your DB query. Example with SQLAlchemy:
    # from db import db, Inventory
    # query = db.session.query(Inventory)
    # if sku_ids:
    #     query = query.filter(Inventory.sku_id.in_(sku_ids))
    # if warehouse_id:
    #     query = query.filter(Inventory.warehouse_id == warehouse_id)
    # if status_filter != "all":
    #     query = query.filter(Inventory.status == status_filter)
    # results = query.all()
    # items = [r.to_dict() for r in results]
    # return {"items": items, "total": len(items), "as_of": date.today().isoformat()}
    raise NotImplementedError("Connect get_stock_levels to your database")


def get_sales_velocity(sku_ids: list, window_days: int = 30) -> dict:
    """
    Expected return shape:
    {
        "velocities": [
            {
                "sku_id": "SKU-001",
                "daily_avg_units": 4.8,
                "total_units_sold": 144,
                "window_days": 30
            },
            ...
        ]
    }
    """
    # TODO: replace with your analytics query.
    # E.g. query order_items grouped by sku_id over last window_days:
    # from datetime import timedelta
    # from db import db, OrderItem
    # cutoff = date.today() - timedelta(days=window_days)
    # rows = (
    #     db.session.query(OrderItem.sku_id, func.sum(OrderItem.qty).label("total"))
    #     .filter(OrderItem.sku_id.in_(sku_ids), OrderItem.created_at >= cutoff)
    #     .group_by(OrderItem.sku_id)
    #     .all()
    # )
    # velocities = [
    #     {"sku_id": r.sku_id, "daily_avg_units": r.total / window_days,
    #      "total_units_sold": r.total, "window_days": window_days}
    #     for r in rows
    # ]
    # return {"velocities": velocities}
    raise NotImplementedError("Connect get_sales_velocity to your analytics source")


def get_supplier_info(sku_ids: list) -> dict:
    """
    Expected return shape:
    {
        "suppliers": [
            {
                "sku_id": "SKU-001",
                "supplier_id": "SUP-12",
                "supplier_name": "Ceramics Co.",
                "contact_email": "orders@ceramicsco.com",
                "lead_time_days": 14,
                "moq": 100,
                "payment_terms": "Net 30"
            },
            ...
        ]
    }
    """
    # TODO: replace with your supplier DB
    # from db import db, Supplier
    # rows = db.session.query(Supplier).filter(Supplier.sku_id.in_(sku_ids)).all()
    # return {"suppliers": [r.to_dict() for r in rows]}
    raise NotImplementedError("Connect get_supplier_info to your database")


def get_inbound_shipments(
    sku_ids: Optional[list] = None,
    include_overdue: bool = True,
) -> dict:
    """
    Expected return shape:
    {
        "shipments": [
            {
                "po_id": "PO-889",
                "sku_id": "SKU-001",
                "qty_ordered": 200,
                "expected_delivery_date": "2025-08-10",
                "supplier_name": "Ceramics Co.",
                "is_overdue": False
            },
            ...
        ]
    }
    """
    # TODO: replace with your DB query
    # from db import db, PurchaseOrder
    # query = db.session.query(PurchaseOrder).filter(PurchaseOrder.status == "sent")
    # if sku_ids:
    #     query = query.filter(PurchaseOrder.sku_id.in_(sku_ids))
    # if not include_overdue:
    #     query = query.filter(PurchaseOrder.expected_delivery_date >= date.today())
    # return {"shipments": [r.to_dict() for r in query.all()]}
    raise NotImplementedError("Connect get_inbound_shipments to your database")


def create_draft_purchase_order(
    supplier_id: str,
    line_items: list,
    notes: str = "",
    priority: str = "normal",
) -> dict:
    """
    Inserts a draft PO. Status is ALWAYS 'draft' — never 'sent'.
    Returns the new PO ID.
    """
    # IMPORTANT: status must always be "draft" — never change this to "sent"
    # TODO: insert into your purchase_orders table. Example:
    # from db import db, PurchaseOrder
    # import json
    # po = PurchaseOrder(
    #     supplier_id=supplier_id,
    #     line_items=json.dumps(line_items),
    #     status="draft",          # <-- hardcoded, never "sent"
    #     priority=priority,
    #     notes=notes,
    #     created_at=date.today(),
    # )
    # db.session.add(po)
    # db.session.commit()
    # return {"po_id": po.id, "status": "draft", "line_item_count": len(line_items)}
    raise NotImplementedError("Connect create_draft_purchase_order to your database")


def send_slack_alert(
    message: str,
    channel: str = "#inventory-ops",
    urgency: str = "info",
) -> dict:
    """
    Sends a Slack message to the ops channel.
    """
    prefix = {"info": "ℹ️", "warning": "⚠️", "critical": "🚨"}.get(urgency, "ℹ️")
    mention = "@channel " if urgency == "critical" else ""
    full_message = f"{prefix} {mention}{message}"

    # TODO: replace with your Slack client
    # from slack_sdk import WebClient
    # slack = WebClient(token=os.environ["SLACK_BOT_TOKEN"])
    # slack.chat_postMessage(channel=channel, text=full_message)

    print(f"[SLACK → {channel}] {full_message}")  # stub for testing
    return {"sent": True, "channel": channel, "urgency": urgency}


# ---------------------------------------------------------------------------
# Reorder quantity helper — used outside the agent for validation/testing
# ---------------------------------------------------------------------------

def calculate_reorder_qty(
    daily_velocity: float,
    lead_time_days: int,
    current_stock: int,
    moq: int,
    safety_factor: float = 1.3,
) -> int:
    """
    reorder_qty = (daily_velocity × lead_time_days × safety_factor) - current_stock
    Rounded up to the nearest supplier MOQ.
    """
    raw = (daily_velocity * lead_time_days * safety_factor) - current_stock
    if raw <= 0:
        return 0
    return math.ceil(raw / moq) * moq
