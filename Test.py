# Broken Python Script for AI Agent Testing

def calculate_average(numbers):
    # ERROR 1 (SyntaxError): Missing a colon at the end of the 'if' statement
    if len(numbers) == 0
        return 0
    
    total = 0
    for num in numbers:
        # ERROR 2 (TypeError): Cannot add a string to an integer
        total += num
        
    return total / len(numbers)

def get_user_scores():
    # Simulated data fetched from an input source
    return [85, 92, "78", 90, 65]

def display_top_scores(scores):
    print("Top Scores:")
    # ERROR 3 (LogicError): This loop will cause an infinite loop because 'i' never increments
    i = 0
    while i < len(scores):
        if scores[i] >= 80:
            print(f"Score: {scores[i]}")

if __name__ == "__main__":
    user_scores = get_user_scores()
    print("Processing scores...")
    
    # This will trigger the Type Error during execution
    avg = calculate_average(user_scores)
    print(f"The average score is: {avg}")
    
    # This will trigger the Infinite Loop
    display_top_scores(user_scores)
