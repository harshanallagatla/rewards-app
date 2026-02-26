import os
import logging
import resend

logger = logging.getLogger(__name__)


def send_redemption_email(to_email: str) -> None:
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    if not api_key or not to_email:
        logger.warning(
            f"Email skipped — RESEND_API_KEY set: {bool(api_key)}, to_email: {bool(to_email)}"
        )
        return

    resend.api_key = api_key

    try:
        resend.Emails.send({
            "from": f"Stardust Rewards <{from_email}>",
            "to": to_email,
            "subject": "Your Redemption - Stardust Rewards",
            "text": "Congrats on your redemption. You will be rewarded soon",
        })
        logger.info(f"Redemption email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send redemption email to {to_email}: {e}")
        raise
