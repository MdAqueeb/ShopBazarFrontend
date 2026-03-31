# agents/inventory/tool_definitions.py
# Pass this list as the `tools` parameter to every client.messages.create() call.

TOOL_DEFINITIONS = [
    {
        "name": "get_stock_levels",
        "description": (
            "Get current stock levels for all SKUs or a filtered subset. "
            "Returns qty, warehouse location, reorder_threshold, minimum_threshold, "
            "and days_of_stock_remaining. Always call this first before any analysis."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sku_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Specific SKU IDs. Omit to fetch all SKUs.",
                },
                "status_filter": {
                    "type": "string",
                    "enum": ["all", "low", "critical", "oos"],
                    "description": "Filter by stock status. Default: all.",
                    "default": "all",
                },
                "warehouse_id": {
                    "type": "string",
                    "description": "Filter by specific warehouse. Omit for all warehouses.",
                },
            },
        },
    },
    {
        "name": "get_sales_velocity",
        "description": (
            "Get average daily units sold per SKU over a given time window. "
            "Used to calculate reorder quantities and detect dead stock."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sku_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "SKU IDs to get velocity for.",
                },
                "window_days": {
                    "type": "integer",
                    "description": "Number of days to average over. Default: 30.",
                    "default": 30,
                },
            },
            "required": ["sku_ids"],
        },
    },
    {
        "name": "get_supplier_info",
        "description": (
            "Get supplier details for given SKUs: supplier name, contact email, "
            "lead time in days, MOQ (minimum order quantity), and payment terms."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sku_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "SKU IDs to look up suppliers for.",
                },
            },
            "required": ["sku_ids"],
        },
    },
    {
        "name": "get_inbound_shipments",
        "description": (
            "Get all pending inbound purchase orders with expected delivery dates "
            "and quantities. Check this before creating new POs to avoid double ordering."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sku_ids": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Filter by SKU. Omit for all pending shipments.",
                },
                "include_overdue": {
                    "type": "boolean",
                    "description": "Include shipments past expected delivery date.",
                    "default": True,
                },
            },
        },
    },
    {
        "name": "create_draft_purchase_order",
        "description": (
            "Create a draft purchase order in the database. "
            "Status is always 'draft' — no email is sent. "
            "A human must approve before it is sent to the supplier. "
            "Group multiple SKUs from the same supplier into one PO."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "supplier_id": {
                    "type": "string",
                    "description": "Supplier ID from get_supplier_info.",
                },
                "line_items": {
                    "type": "array",
                    "description": "List of SKUs and quantities to order.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "sku_id": {"type": "string"},
                            "quantity": {"type": "integer"},
                            "unit_cost": {"type": "number"},
                            "requested_delivery_date": {
                                "type": "string",
                                "description": "ISO 8601 date e.g. 2025-08-15",
                            },
                        },
                        "required": ["sku_id", "quantity", "requested_delivery_date"],
                    },
                },
                "notes": {
                    "type": "string",
                    "description": "Any notes for the ops team or supplier.",
                },
                "priority": {
                    "type": "string",
                    "enum": ["normal", "urgent"],
                    "default": "normal",
                },
            },
            "required": ["supplier_id", "line_items"],
        },
    },
    {
        "name": "send_slack_alert",
        "description": (
            "Send a formatted alert to the inventory ops Slack channel. "
            "Use for critical stockouts or urgent flags needing same-day human attention. "
            "For routine low-stock flags, include them in the nightly report instead."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The alert message. Be specific: include SKU, qty, days remaining.",
                },
                "channel": {
                    "type": "string",
                    "description": "Slack channel to post to.",
                    "default": "#inventory-ops",
                },
                "urgency": {
                    "type": "string",
                    "enum": ["info", "warning", "critical"],
                    "description": "Sets emoji prefix and @here/@channel mention.",
                    "default": "info",
                },
            },
            "required": ["message"],
        },
    },
]
