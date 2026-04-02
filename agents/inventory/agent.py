# agents/inventory/agent.py
# Agentic tool-use loop for the Inventory Agent.

import json
import os
from typing import Optional

import anthropic

from .prompts import INVENTORY_SYSTEM_PROMPT
from .tool_definitions import TOOL_DEFINITIONS
from .tools import (
    create_draft_purchase_order,
    get_inbound_shipments,
    get_sales_velocity,
    get_stock_levels,
    get_supplier_info,
    send_slack_alert,
)

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

TOOL_MAP = {
    "get_stock_levels": get_stock_levels,
    "get_sales_velocity": get_sales_velocity,
    "get_supplier_info": get_supplier_info,
    "get_inbound_shipments": get_inbound_shipments,
    "create_draft_purchase_order": create_draft_purchase_order,
    "send_slack_alert": send_slack_alert,
}

MAX_ITERATIONS = 20  # safety guard against infinite loops


def run_inventory_agent(
    user_message: str,
    run_id: Optional[str] = None,
) -> str:
    """
    Runs the inventory agent with an agentic tool-use loop.
    Returns the final text response from the agent.
    """
    messages = [{"role": "user", "content": user_message}]
    iteration = 0

    while iteration < MAX_ITERATIONS:
        iteration += 1

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            system=INVENTORY_SYSTEM_PROMPT,
            tools=TOOL_DEFINITIONS,
            messages=messages,
        )

        # Log every step for auditability
        _log_agent_step(run_id, iteration, response)

        # Agent finished — return final answer
        if response.stop_reason == "end_turn":
            return _extract_text(response)

        # Agent wants to call tools
        if response.stop_reason == "tool_use":
            # Add assistant message (with tool_use blocks) to history
            messages.append({"role": "assistant", "content": response.content})

            # Execute each tool call and collect results
            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue

                tool_fn = TOOL_MAP.get(block.name)
                if not tool_fn:
                    result = {"error": f"Unknown tool: {block.name}"}
                else:
                    try:
                        result = tool_fn(**block.input)
                    except NotImplementedError as e:
                        result = {"error": f"Tool not yet connected: {e}"}
                    except Exception as e:
                        result = {"error": str(e)}

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result),
                })

            # Feed tool results back as a user message
            messages.append({"role": "user", "content": tool_results})

        else:
            # Unexpected stop reason — exit loop
            break

    return "Agent reached maximum iterations. Check logs."


def _extract_text(response) -> str:
    for block in response.content:
        if block.type == "text":
            return block.text
    return ""


def _log_agent_step(run_id: Optional[str], iteration: int, response) -> None:
    """
    Replace with your logging solution (DB, file, CloudWatch, etc.)
    """
    tool_calls = [
        {"tool": b.name, "input": b.input}
        for b in response.content
        if b.type == "tool_use"
    ]
    print(f"[{run_id}] Step {iteration} | stop={response.stop_reason} | tools={tool_calls}")
