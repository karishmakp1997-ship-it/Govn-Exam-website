# performance/analytics.py

from mock_tests.models import TestAttempt, Answer


def get_accuracy_over_time(user, limit=5):
    attempts = TestAttempt.objects.filter(user=user, is_submitted=True).order_by('-submitted_at')[:limit]
    return [
        {"date": a.submitted_at.strftime('%Y-%m-%d'), "accuracy": float(a.accuracy or 0)}
        for a in reversed(attempts)
    ]


def get_subject_mastery(user):
    answers = Answer.objects.filter(attempt__user=user, attempt__is_submitted=True)
    subject_stats = {}

    for answer in answers:
        subject = answer.question.subject
        if subject not in subject_stats:
            subject_stats[subject] = {"correct": 0, "total": 0}
        subject_stats[subject]["total"] += 1
        if answer.selected_option == answer.question.correct_option:
            subject_stats[subject]["correct"] += 1

    return [
        {
            "subject": subject,
            "accuracy": round((stats["correct"] / stats["total"]) * 100, 1) if stats["total"] > 0 else 0
        }
        for subject, stats in subject_stats.items()
    ]


def get_overall_stats(user):
    """
    Score: average of (attempt score / that test's total questions) across all submitted attempts,
           as a percentage — since correct answers score 1 point each with no per-question weighting.
    Accuracy: correct answers / attempted answers (skipped questions excluded).
    Attempt Rate: attempted answers / total questions across attempts (skipped questions count against this).
    """
    attempts = TestAttempt.objects.filter(user=user, is_submitted=True)
    tests_completed = attempts.count()

    if tests_completed == 0:
        return {"score": 0, "accuracy": 0, "attempt_rate": 0, "tests_completed": 0}

    score_percentages = []
    for a in attempts:
        total_q = a.test_series.total_questions
        if total_q > 0:
            pct = max(0, (float(a.score) / total_q) * 100)
            score_percentages.append(pct)
    avg_score = round(sum(score_percentages) / len(score_percentages), 1) if score_percentages else 0

    answers = Answer.objects.filter(attempt__user=user, attempt__is_submitted=True)
    total_answers = answers.count()
    attempted_answers = answers.exclude(selected_option__isnull=True).exclude(selected_option="").count()
    correct_answers = sum(1 for a in answers if a.selected_option == a.question.correct_option)

    accuracy = round((correct_answers / attempted_answers) * 100, 1) if attempted_answers > 0 else 0
    attempt_rate = round((attempted_answers / total_answers) * 100, 1) if total_answers > 0 else 0

    return {
        "score": avg_score,
        "accuracy": accuracy,
        "attempt_rate": attempt_rate,
        "tests_completed": tests_completed,
    }