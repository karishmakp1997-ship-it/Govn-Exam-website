def check_eligibility(user_qualification, user_age, rule):
    reasons = []
    is_eligible = True

    allowed_quals = [q.strip().lower() for q in rule.allowed_qualifications.split(',')]
    if user_qualification.strip().lower() not in allowed_quals:
        is_eligible = False
        reasons.append(f"Required qualification: {rule.allowed_qualifications}. Your qualification: {user_qualification}. Does not meet requirement.")
    else:
        reasons.append(f"Required qualification: {rule.allowed_qualifications}. Your qualification: {user_qualification}. Meets requirement.")

    if rule.min_age and user_age < rule.min_age:
        is_eligible = False
        reasons.append(f"Minimum age required: {rule.min_age}. Your age: {user_age}. Does not meet requirement.")
    elif rule.max_age and user_age > rule.max_age:
        is_eligible = False
        reasons.append(f"Maximum age allowed: {rule.max_age}. Your age: {user_age}. Does not meet requirement.")
    else:
        reasons.append(f"Age requirement: {rule.min_age}-{rule.max_age}. Your age: {user_age}. Meets requirement.")

    return is_eligible, reasons