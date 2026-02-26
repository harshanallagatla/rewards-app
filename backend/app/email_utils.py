import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def send_redemption_email(to_email: str) -> None:
    """Send redemption confirmation email. Logs errors; skips if SMTP not configured."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM") or smtp_user

    if not all([smtp_host, smtp_user, smtp_password, smtp_from, to_email]):
        logger.warning(
            "Email skipped — missing config. "
            f"host={bool(smtp_host)} user={bool(smtp_user)} "
            f"password={bool(smtp_password)} to={bool(to_email)}"
        )
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your Redemption - Stardust Rewards"
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.attach(MIMEText("Congrats on your redemption. You will be rewarded soon", "plain"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, to_email, msg.as_string())
        logger.info(f"Redemption email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send redemption email to {to_email}: {e}")
        raise
