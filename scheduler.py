# scheduler.py
# Runs the Inventory Agent on a cron schedule.
# Usage: python scheduler.py

from datetime import date

from apscheduler.schedulers.blocking import BlockingScheduler

from agents.inventory.agent import run_inventory_agent
from agents.inventory.prompts import DEAD_STOCK_PROMPT, NIGHTLY_PROMPT

scheduler = BlockingScheduler(timezone="Asia/Kolkata")  # adjust to your timezone


@scheduler.scheduled_job("cron", hour=2, minute=0)
def nightly_stock_scan():
    run_id = f"nightly-{date.today()}"
    prompt = NIGHTLY_PROMPT.format(today=date.today().isoformat())
    result = run_inventory_agent(prompt, run_id=run_id)
    _save_run_log(run_id, result)
    print(f"[{run_id}] Done.\n{result}")


@scheduler.scheduled_job("cron", day_of_week="mon", hour=8, minute=0)
def weekly_dead_stock():
    run_id = f"deadstock-{date.today()}"
    result = run_inventory_agent(DEAD_STOCK_PROMPT, run_id=run_id)
    _email_team(subject="Weekly dead stock report", body=result)
    print(f"[{run_id}] Done.\n{result}")


def _save_run_log(run_id: str, result: str) -> None:
    # TODO: persist to your DB or a log file
    # Example: write to a logs/ directory
    # import pathlib
    # pathlib.Path("logs").mkdir(exist_ok=True)
    # pathlib.Path(f"logs/{run_id}.txt").write_text(result)
    pass


def _email_team(subject: str, body: str) -> None:
    # TODO: send via SendGrid / SES / SMTP
    # import sendgrid
    # sg = sendgrid.SendGridAPIClient(api_key=os.environ["SENDGRID_API_KEY"])
    # ...
    pass


if __name__ == "__main__":
    print("Inventory scheduler started. Press Ctrl+C to stop.")
    scheduler.start()
