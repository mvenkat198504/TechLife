---
id: csharp-coding-questions-001
slug: chsarp-coding-questions
title: ATM withdrawal logic in C# using a `Dictionary<int, int>`
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Coding Questions and Answers in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# ATM withdrawal logic in C# using a `Dictionary<int, int>`.

## ATM withdrawal logic in C# using a `Dictionary<int, int>`.

```csharp
static void Main()
    {
        var atmInventory = new Dictionary<int, int>
        {
            { 2000, 5 },
            { 500, 10 },
            { 200, 10 },
            { 100, 5 }
        };

        // Test Case 1
        WithdrawCash(5000, atmInventory);

        Console.WriteLine();

        // Test Case 2
        WithdrawCash(15, atmInventory);
    }


     static void WithdrawCash(int amount, Dictionary<int, int> atmInventory)
    {
        // Validate amount
        if (amount <= 0)
        {
            Console.WriteLine("Invalid amount.");
            return;
        }

        int remainingAmount = amount;

        // Stores notes to dispense
        Dictionary<int, int> dispensed = new Dictionary<int, int>();

        // Sort denominations highest to lowest
        var denominations = atmInventory.Keys
                                       .OrderByDescending(x => x);

        foreach (int denomination in denominations)
        {
            int availableNotes = atmInventory[denomination];

            if (remainingAmount >= denomination && availableNotes > 0)
            {
                int notesNeeded = remainingAmount / denomination;

                int notesToDispense = Math.Min(
                    notesNeeded,
                    availableNotes
                );

                if (notesToDispense > 0)
                {
                    dispensed[denomination] = notesToDispense;

                    remainingAmount -= notesToDispense * denomination;
                }
            }
        }

        // Exact amount cannot be dispensed
        if (remainingAmount > 0)
        {
            Console.WriteLine(
                "Transaction failed: Cannot dispense exact amount."
            );
            return;
        }

        // Update ATM inventory
        foreach (var item in dispensed)
        {
            atmInventory[item.Key] -= item.Value;
        }

        Console.WriteLine($"Withdrawal successful: {amount}");

        Console.WriteLine("Dispensed:");

        foreach (var item in dispensed)
        {
            Console.WriteLine(
                $"{item.Key} x {item.Value}"
            );
        }
    }
```

%%%
---
id: csharp-coding-questions-002
slug: chsarp-coding-questions
title: Find the first non-repeating character in a string  in C#
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Find the first non-repeating character in a string in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# Find the first non-repeating character in a string  

## Find the first non-repeating character in a string in C#.

```csharp
static void Main()
{
    string inputString = "swiss";
   var firstNonRepeatingChar = FirstNonRepeatingCharacter(inputString);
   if (firstNonRepeatingChar != '\0')
   {
       Console.WriteLine($"First non-repeating character: {firstNonRepeatingChar}");
   }
   else
   {
       Console.WriteLine("No non-repeating character found.");
   }
}

public static char FirstNonRepeatingCharacter(string input)
{
    Dictionary<char, int> charCount = new Dictionary<char, int>();
    foreach (char c in input)
    {
        if (charCount.ContainsKey(c))
        {
            charCount[c]++;
        }
        else
        {
            charCount[c] = 1;
        }
    }
    foreach (char c in input)
    {
        if (charCount[c] == 1)
        {
            return c;
        }
    }
    return '\0'; // Return null character if no non-repeating character is found
}
```

%%%
---
id: csharp-coding-questions-003
slug: chsarp-coding-questions
title: Find the occurance of each character in a string  in C#
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Find the occurance of each character in a string in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# Find the occurance of each character in a string

## Find the occurance of each character in a string in C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter a string:");
    string input = Console.ReadLine();
    Dictionary<char, int> charCount = CountCharacterOccurrences(input);
    foreach (var kvp in charCount)
    {
    Console.WriteLine($"Character: {kvp.Key}, Occurrence: {kvp.Value}");
    }
}

public static Dictionary<char, int> CountCharacterOccurrences(string input)
{
    Dictionary<char, int> charCount = new Dictionary<char, int>();
    foreach (char c in input)
    {
        if (charCount.ContainsKey(c))
        {
            charCount[c]++;
        }
        else
        {
            charCount[c] = 1;
        }
    }
    return charCount;
}
```

%%%
---
id: csharp-coding-questions-004
slug: chsarp-coding-questions
title: Find the duplicates charcters in a string and return the duplicate characters  in C#
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Find the duplicates charcters in a string and return the duplicate characters in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# Find the duplicates charcters in a string and return the duplicate characters in C#.
## Find the duplicates charcters in a string and return the duplicate characters in C#.


```csharp
static void Main()
{
    Console.WriteLine("Enter a string:");
    string inputString = Console.ReadLine();
    Dictionary<char, int> charCount = CountCharacterOccurrences(inputString);
    Console.WriteLine("Duplicate characters:");
    foreach (var kvp in charCount)
    {
    if (kvp.Value > 1)
    {
        Console.WriteLine($"Character: {kvp.Key}, Occurrence: {kvp.Value}");
    }
    }
}
public static Dictionary<char, int> CountCharacterOccurrences(string input)
{
    Dictionary<char, int> charCount = new Dictionary<char, int>();
    foreach (char c in input)
    {
        if (charCount.ContainsKey(c))
        {
            charCount[c]++;
        }
        else
        {
            charCount[c] = 1;
        }
    }
    return charCount;
}
```

%%%
---
id: csharp-coding-questions-005
slug: chsarp-coding-questions
title: Find the maximum and minimum number in an array in C#
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Find the maximum and minimum number in an array in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---
# Find the maximum and minimum number in an array

## Find the maximum and minimum number in an array in C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter the elements of the array separated by spaces:");
    string[] input = Console.ReadLine().Split(' ');
    int[] array = Array.ConvertAll(input, int.Parse);
    int max = FindMax(array);
    int min = FindMin(array);
    Console.WriteLine($"Maximum number: {max}");
    Console.WriteLine($"Minimum number: {min}");
}

public static int FindMax(int[] array)
{
    int max = array[0];
    foreach (int num in array)
    {
        if (num > max) max = num;
    }
    return max;
}
public static int FindMin(int[] array)
{
    int min = array[0];
    foreach (int num in array)
    {
        if (num < min) min = num;
    }
    return min;
}

```

%%%
---
id: csharp-coding-questions-006
slug: chsarp-coding-questions
title:Check if a given number is prime or not in C#
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Check if a given number is prime or not in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# Check if a given number is prime or not in C#.
## Check if a given number is prime or not in C#.

```csharp
static void Main()
{
   Console.WriteLine("Enter a number:");
    int number = int.Parse(Console.ReadLine());
    bool isPrime = IsPrime(number);
    Console.WriteLine($"{number} is {(isPrime ? "prime" : "not prime")}.");
}
public static bool IsPrime(int number)
{
    if (number <= 1) return false;
    if (number == 2) return true;
    if (number % 2 == 0) return false;
    for (int i = 3; i <= Math.Sqrt(number); i += 2)
    {
        if (number % i == 0) return false;
    }
    return true;
}

```

%%%
---
id: csharp-coding-questions-007
slug: chsarp-coding-questions
title: Check if a given string is a palindrome or not C#.
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Check if a given string is a palindrome or not C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# check if a given string is a palindrome or not C#.
## check if a given string is a palindrome or not C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter a string:");
    string inputString = Console.ReadLine();
    bool isPalindrome = IsPalindrome(inputString);
    Console.WriteLine($"{inputString} is {(isPalindrome ? "a palindrome" : "not a palindrome")}.");
}
public static bool IsPalindrome(string input)
{
    int left = 0;
    int right = input.Length - 1;
    while (left < right)
    {
        if (input[left] != input[right])
        {
            return false;
        }
        left++;
        right--;
    }
    return true;
} return true;

```


%%%
---
id: csharp-coding-questions-008
slug: chsarp-coding-questions
title: Swap two numbers without using a third variable C#.
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Swap two numbers without using a third variable C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---
# Swap two numbers without using a third variable C#.
## Swap two numbers without using a third variable C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter the first number:");
    int num1 = int.Parse(Console.ReadLine());
    Console.WriteLine("Enter the second number:");
    int num2 = int.Parse(Console.ReadLine());

    SwapNumbers(ref num1, ref num2);
    Console.WriteLine($"After swapping: num1 = {num1}, num2 = {num2}");
}
public static void SwapNumbers(ref int num1, ref int num2)
{
    num1 = num1 + num2;
    num2 = num1 - num2;
    num1 = num1 - num2;
}
```


%%%
---
id: csharp-coding-questions-009
slug: chsarp-coding-questions
title: left/right shift of an array without using built-in methods in C#.
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: left/right shift of an array without using built-in methods in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---
# left/right shift of an array without using built-in methods in C#.
## left/right shift of an array without using built-in methods in C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter the elements of the array separated by spaces:");
    string[] input = Console.ReadLine().Split(' ');
    int[] array = Array.ConvertAll(input, int.Parse);
    Console.WriteLine("Enter the number of positions to shift:");
    int positions = int.Parse(Console.ReadLine());
    Console.WriteLine("Enter the direction (left/right):");
    string direction = Console.ReadLine();
    int[] shiftedArray = ShiftArray(array, positions, direction);
    Console.WriteLine("Shifted array: " + string.Join(" ", shiftedArray));
}
public static int[] ShiftArray(int[] array, int positions, string direction)
{
    int length = array.Length;
    int[] shiftedArray = new int[length];
    positions = positions % length; // Handle cases where positions > length
    if (direction.ToLower() == "left")
    {
        for (int i = 0; i < length; i++)
        {
            shiftedArray[i] = array[(i + positions) % length];
        }
    }
    else if (direction.ToLower() == "right")
    {
        for (int i = 0; i < length; i++)
        {
            shiftedArray[i] = array[(i - positions + length) % length];
        }
    }
    else
    {
        throw new ArgumentException("Direction must be 'left' or 'right'.");
    }
    return shiftedArray;
}
```

%%%
---
id: csharp-coding-questions-010
slug: chsarp-coding-questions
title: Remove duplicates from string and return the unique characters in C#.
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Remove duplicates from string and return the unique characters in C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# Remove duplicates from string and return the unique characters in C#.
## Remove duplicates from string and return the unique characters in C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter a string:");
    string inputString = Console.ReadLine();
    string uniqueChars = RemoveDuplicates(inputString);
    Console.WriteLine("Unique characters: " + uniqueChars);
}
public static string RemoveDuplicates(string input)
{
    HashSet<char> seen = new HashSet<char>();
    StringBuilder uniqueChars = new StringBuilder();
    foreach (char c in input)
    {
        if (!seen.Contains(c))
        {
            seen.Add(c);
            uniqueChars.Append(c);
        }
    }
    return uniqueChars.ToString();
}
```

%%%
---
id: csharp-coding-questions-011
slug: chsarp-coding-questions
title: Reverse a given string without using built-in methods C#.
categoryId: csharp
subcategory: coding-questions
difficulty: Basic
tags:
  - coding-questions
  - c# coding
  - C# practical
summary: Reverse a given string without using built-in methods C#.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# RReverse a given string without using built-in methods in C#.
## Reverse a given string without using built-in methods in C#.

```csharp
static void Main()
{
    Console.WriteLine("Enter a word to reverse:");
    string inputWord = Console.ReadLine();
    string outputWord = ReverseWord(inputWord);
    Console.WriteLine("Reversed word: " + outputWord);
}
public static string ReverseWord(string word)
{
    char[] reversed = new char[word.Length];
    for (int i = 0; i < word.Length; i++)
    {
        reversed[i] = word[word.Length - 1 - i];
    }
    return new string(reversed);
}
```