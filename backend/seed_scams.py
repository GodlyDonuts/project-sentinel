from services.memory import add_scam_pattern

SCAM_PHRASES = [
    ("I am calling from the IRS regarding a warrant.", "Government Impersonation"),
    ("We have detected suspicious activity on your Social Security number.", "Identity Theft"),
    ("You need to buy a Target gift card to pay the fine.", "Gift Card Fraud"),
    ("This is Microsoft Support, your computer has a virus.", "Tech Support Scam"),
    ("You have won a lottery but need to pay taxes first.", "Advance Fee Fraud"),
    ("Grandma, I'm in jail and need bail money.", "Grandparent Scam"),
    ("Your car warranty is about to expire.", "Robocall"),
    ("Invest in this crypto opportunity for 1000% returns.", "Investment Fraud"),
    ("This is Amazon, your order for an iPhone has been confirmed.", "Refund Scam"),
    ("Click this link to verify your bank account details.", "Phishing")
]

def seed():
    print("Seeding SmartMemory with known scam patterns...")
    for phrase, category in SCAM_PHRASES:
        success = add_scam_pattern(phrase, category)
        if success:
            print(f"Added: {category}")
        else:
            print(f"Failed to add: {category}")
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
