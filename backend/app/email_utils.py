import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM") or SMTP_USER


def send_redemption_email(to_email: str) -> None:
    """Send redemption confirmation email. Silently skips if SMTP is not configured."""
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD, to_email]):
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your Redemption - Stardust Rewards"
    msg["From"] = SMTP_FROM
    msg["To"] = to_email

    body = "Congrats on your redemption. You will be rewarded soon"
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM, to_email, msg.as_string())
