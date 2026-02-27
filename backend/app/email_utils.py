import os
import logging
import resend

logger = logging.getLogger(__name__)


def send_redemption_email(to_email: str, username: str) -> None:
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
            "subject": "Your Redemption",
            "text": f"Congrats {username} on your redemption. You will be rewarded soon",
        })
        logger.info(f"Redemption email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send redemption email to {to_email}: {e}")
        raise


def send_harsha_redemption_notification(
    to_email: str,
    redeemer_username: str,
    reward_title: str,
    quantity: int,
    total_cost: int,
    remaining_points: int,
) -> None:
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")

    if not api_key or not to_email:
        logger.warning(
            f"Harsha notification skipped — RESEND_API_KEY set: {bool(api_key)}, to_email: {bool(to_email)}"
        )
        return

    resend.api_key = api_key

    qty_label = f"{quantity}× " if quantity > 1 else ""
    body = (
        f"Redemption Alert\n\n"
        f"User: {redeemer_username}\n"
        f"Redeemed: {qty_label}{reward_title}\n"
        f"Points used: {total_cost}\n"
        f"Remaining points: {remaining_points}\n"
    )

    try:
        resend.Emails.send({
            "from": f"Stardust Rewards <{from_email}>",
            "to": to_email,
            "subject": f"[Redemption] {redeemer_username} redeemed {qty_label}{reward_title}",
            "text": body,
        })
        logger.info(f"Harsha redemption notification sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send harsha redemption notification to {to_email}: {e}")
        raise
