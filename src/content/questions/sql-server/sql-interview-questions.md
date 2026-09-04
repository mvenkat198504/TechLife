---
id: sql-interview-questions-001
slug:  sql-server_questions
categoryId: sql-server
subcategory: SQL_Interview_Questions
difficulty: Basic
title: SQL Interview Questions and Answers: Beginner to Expert
description: A complete guide to SQL interview questions with sample code, covering beginner, intermediate, advanced, and expert (scenario-based) topics including Nth highest salary queries.
tags: [sql, interview, database, queries]
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# SQL Interview Questions and Answers (Beginner to Expert)

A complete, static-site-ready reference covering SQL fundamentals through advanced scenario-based questions, with sample code and explanations. All examples use a common sample schema (see below) unless otherwise noted.

## Sample Schema Used Throughout

```sql
CREATE TABLE employees (
    emp_id      INT PRIMARY KEY,
    emp_name    VARCHAR(100),
    dept_id     INT,
    salary      DECIMAL(10,2),
    manager_id  INT,
    hire_date   DATE
);

CREATE TABLE departments (
    dept_id     INT PRIMARY KEY,
    dept_name   VARCHAR(100)
);

CREATE TABLE orders (
    order_id    INT PRIMARY KEY,
    customer_id INT,
    order_date  DATE,
    amount      DECIMAL(10,2)
);
```

---

## Table of Contents

1. [Beginner Level](#beginner-level)
2. [Intermediate Level](#intermediate-level)
3. [Advanced Level](#advanced-level)
4. [Expert / Scenario-Based Level](#expert--scenario-based-level)
5. [Nth Highest Salary — All Approaches](#nth-highest-salary--all-approaches)
6. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Beginner Level

## Q1. What is SQL and what are its sub-languages?

SQL (Structured Query Language) is used to manage relational databases. It is divided into:

- **DDL** (Data Definition Language): `CREATE`, `ALTER`, `DROP`, `TRUNCATE`
- **DML** (Data Manipulation Language): `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- **DCL** (Data Control Language): `GRANT`, `REVOKE`
- **TCL** (Transaction Control Language): `COMMIT`, `ROLLBACK`, `SAVEPOINT`

## Q2. How do you select all employees with a salary greater than 50000?

```sql
SELECT emp_name, salary
FROM employees
WHERE salary > 50000;
```

## Q3. Difference between `WHERE` and `HAVING`?

`WHERE` filters rows **before** aggregation; `HAVING` filters groups **after** aggregation.

```sql
-- WHERE example
SELECT * FROM employees WHERE dept_id = 10;

-- HAVING example
SELECT dept_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 60000;
```

## Q4. How do you remove duplicate rows from a result set?

```sql
SELECT DISTINCT dept_id FROM employees;
```

## Q5. Difference between `DELETE`, `TRUNCATE`, and `DROP`?

| Command  | Removes | Rollback? | Resets identity | Fires triggers |
|----------|---------|-----------|------------------|----------------|
| DELETE   | rows (with WHERE optional) | Yes | No | Yes |
| TRUNCATE | all rows | Usually no (DB-dependent) | Yes | No |
| DROP     | entire table structure | No | N/A | No |

## Q6. Write a query to sort employees by salary descending and get the top 5.

```sql
SELECT emp_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;
```

## Q7. What is a `NULL` and how do you check for it?

`NULL` represents unknown/missing data. Use `IS NULL` / `IS NOT NULL` — never `= NULL`.

```sql
SELECT * FROM employees WHERE manager_id IS NULL;
```

## Q8. Explain `GROUP BY` with an example.

```sql
SELECT dept_id, COUNT(*) AS total_employees
FROM employees
GROUP BY dept_id;
```

## Q9. What are Primary Key and Foreign Key?

- **Primary Key**: uniquely identifies each row; cannot be NULL; only one per table.
- **Foreign Key**: a column referencing the primary key of another table, enforcing referential integrity.

```sql
ALTER TABLE employees
ADD CONSTRAINT fk_dept
FOREIGN KEY (dept_id) REFERENCES departments(dept_id);
```

## Q10. Difference between `UNION` and `UNION ALL`?

`UNION` removes duplicates (slower, implicit sort/dedup). `UNION ALL` keeps all rows (faster).

```sql
SELECT emp_name FROM employees WHERE dept_id = 1
UNION
SELECT emp_name FROM employees WHERE dept_id = 2;
```

---

## Intermediate Level

## Q11. Explain the different types of JOINs.

```sql
-- INNER JOIN: only matching rows
SELECT e.emp_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN: all rows from left + matches from right (NULL if none)
SELECT e.emp_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- RIGHT JOIN: all rows from right + matches from left
SELECT e.emp_name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;

-- FULL OUTER JOIN: all rows from both sides
SELECT e.emp_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;
```

## Q12. Find employees who do NOT belong to any department.

```sql
SELECT e.emp_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;
```

## Q13. What is a self join? Give an example finding each employee's manager name.

```sql
SELECT e.emp_name AS employee, m.emp_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

## Q14. Write a query using a subquery to find employees earning above the average salary.

```sql
SELECT emp_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

## Q15. Difference between a correlated and a non-correlated subquery?

A **non-correlated** subquery runs independently once. A **correlated** subquery references the outer query and runs once per outer row.

```sql
-- Correlated: departments where max salary > 70000, evaluated per department
SELECT dept_id
FROM departments d
WHERE EXISTS (
    SELECT 1 FROM employees e
    WHERE e.dept_id = d.dept_id
    GROUP BY e.dept_id
    HAVING MAX(e.salary) > 70000
);
```

## Q16. Difference between `EXISTS` and `IN`?

`EXISTS` stops at the first match (often faster with correlated subqueries and NULL-safe); `IN` compares against a full list and can behave unexpectedly with NULLs.

```sql
SELECT * FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.dept_id);
```

## Q17. Write a query to count employees per department, including departments with zero employees.

```sql
SELECT d.dept_name, COUNT(e.emp_id) AS emp_count
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_name;
```

## Q18. What is the difference between `CHAR`, `VARCHAR`, and `TEXT`?

- `CHAR(n)`: fixed length, padded with spaces.
- `VARCHAR(n)`: variable length up to n, more storage-efficient.
- `TEXT`: variable, unbounded (or very large) length, used for large text blobs.

## Q19. Write a query to find duplicate emails in a `users` table.

```sql
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

## Q20. What are indexes and why do they matter?

An index is a data structure (commonly B-Tree) that speeds up row lookups at the cost of extra storage and slower writes. Use indexes on columns frequently used in `WHERE`, `JOIN`, and `ORDER BY` clauses.

```sql
CREATE INDEX idx_emp_dept ON employees(dept_id);
```

---

## Advanced Level

## Q21. What are Window Functions? Give an example.

Window functions perform calculations across a set of rows related to the current row **without collapsing them** (unlike `GROUP BY`).

```sql
SELECT emp_name, dept_id, salary,
       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_rank
FROM employees;
```

## Q22. Difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`?

| Function        | Ties handled as | Gaps after tie |
|-----------------|------------------|-----------------|
| ROW_NUMBER()    | unique sequential number, even for ties | N/A |
| RANK()          | same rank for ties | leaves gaps (e.g., 1,2,2,4) |
| DENSE_RANK()    | same rank for ties | no gaps (e.g., 1,2,2,3) |

```sql
SELECT emp_name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,
       RANK()       OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk
FROM employees;
```

## Q23. What is a CTE (Common Table Expression)? Rewrite a nested subquery using one.

```sql
WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY dept_id
)
SELECT e.emp_name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_sal;
```

## Q24. Write a recursive CTE to generate an employee hierarchy (org chart).

```sql
WITH RECURSIVE org_chart AS (
    -- Anchor: top-level employees (no manager)
    SELECT emp_id, emp_name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive step: find employees reporting to previous level
    SELECT e.emp_id, e.emp_name, e.manager_id, oc.level + 1
    FROM employees e
    INNER JOIN org_chart oc ON e.manager_id = oc.emp_id
)
SELECT * FROM org_chart ORDER BY level, emp_name;
```

## Q25. Calculate a running total (cumulative sum) of order amounts by date.

```sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY order_date;
```

## Q26. Find the month-over-month percentage growth in total sales.

```sql
WITH monthly_sales AS (
    SELECT DATE_TRUNC('month', order_date) AS month,
           SUM(amount) AS total_sales
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT month,
       total_sales,
       LAG(total_sales) OVER (ORDER BY month) AS prev_month_sales,
       ROUND(
           (total_sales - LAG(total_sales) OVER (ORDER BY month))
           / LAG(total_sales) OVER (ORDER BY month) * 100, 2
       ) AS pct_growth
FROM monthly_sales
ORDER BY month;
```

## Q27. What is the difference between `LEAD()` and `LAG()`?

`LAG()` accesses a value from a **previous** row; `LEAD()` accesses a value from a **following** row, both within the defined window/order.

```sql
SELECT emp_name, hire_date,
       LAG(hire_date) OVER (ORDER BY hire_date) AS previous_hire,
       LEAD(hire_date) OVER (ORDER BY hire_date) AS next_hire
FROM employees;
```

## Q28. Explain query execution order (logical processing order).

```text
FROM  →  JOIN  →  WHERE  →  GROUP BY  →  HAVING  →  SELECT  →  DISTINCT  →  ORDER BY  →  LIMIT/OFFSET
```
This is why column aliases defined in `SELECT` can't be used in `WHERE`, but can be used in `ORDER BY`.

## Q29. What is a materialized view versus a regular view?

A **view** is a saved query executed live each time it's referenced (no storage of data). A **materialized view** stores the result set physically and must be refreshed periodically, trading freshness for query speed.

```sql
CREATE MATERIALIZED VIEW dept_salary_summary AS
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id;

REFRESH MATERIALIZED VIEW dept_salary_summary;
```

## Q30. How would you optimize a slow query?

- Check the execution plan (`EXPLAIN` / `EXPLAIN ANALYZE`).
- Add appropriate indexes on filter/join columns.
- Avoid `SELECT *`; select only needed columns.
- Avoid functions on indexed columns in `WHERE` (prevents index usage).
- Replace correlated subqueries with joins/window functions where possible.
- Partition very large tables.
- Update table statistics for the query planner.

---

## Expert / Scenario-Based Level

## Q31. Scenario: Find the department with the highest average salary.

```sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
ORDER BY avg_salary DESC
LIMIT 1;
```

## Q32. Scenario: Find employees who earn more than their manager.

```sql
SELECT e.emp_name AS employee, e.salary AS emp_salary,
       m.emp_name AS manager, m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;
```

## Q33. Scenario: Find duplicate rows in a table and delete all but one copy.

```sql
-- Identify duplicates using ROW_NUMBER over all columns that define a duplicate
WITH ranked AS (
    SELECT emp_id,
           ROW_NUMBER() OVER (PARTITION BY emp_name, dept_id, salary ORDER BY emp_id) AS rn
    FROM employees
)
DELETE FROM employees
WHERE emp_id IN (SELECT emp_id FROM ranked WHERE rn > 1);
```

## Q34. Scenario: Find consecutive days with sales (the "gaps and islands" problem).

```sql
WITH numbered AS (
    SELECT order_date,
           ROW_NUMBER() OVER (ORDER BY order_date) AS rn
    FROM (SELECT DISTINCT order_date FROM orders) t
),
grouped AS (
    SELECT order_date,
           order_date - (rn * INTERVAL '1 day') AS grp
    FROM numbered
)
SELECT MIN(order_date) AS island_start,
       MAX(order_date) AS island_end,
       COUNT(*) AS consecutive_days
FROM grouped
GROUP BY grp
ORDER BY island_start;
```

## Q35. Scenario: Pivot rows into columns (e.g., total sales per quarter as columns).

```sql
SELECT
    customer_id,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 1 THEN amount ELSE 0 END) AS Q1,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 2 THEN amount ELSE 0 END) AS Q2,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 3 THEN amount ELSE 0 END) AS Q3,
    SUM(CASE WHEN EXTRACT(QUARTER FROM order_date) = 4 THEN amount ELSE 0 END) AS Q4
FROM orders
GROUP BY customer_id;
```

## Q36. Scenario: Find the second most recent order for each customer.

```sql
WITH ranked AS (
    SELECT customer_id, order_id, order_date,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders
)
SELECT customer_id, order_id, order_date
FROM ranked
WHERE rn = 2;
```

## Q37. Scenario: Detect customers who made a purchase every month for the last 6 months (loyal customers).

```sql
SELECT customer_id
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY customer_id
HAVING COUNT(DISTINCT DATE_TRUNC('month', order_date)) = 6;
```

## Q38. Scenario: Find the median salary per department (no built-in `MEDIAN()`).

```sql
WITH ranked AS (
    SELECT dept_id, salary,
           PERCENT_RANK() OVER (PARTITION BY dept_id ORDER BY salary) AS pr
    FROM employees
)
SELECT dept_id, AVG(salary) AS median_salary
FROM ranked
WHERE pr BETWEEN 0.4 AND 0.6   -- approximate; use PERCENTILE_CONT for exact median
GROUP BY dept_id;

-- Exact median using PERCENTILE_CONT (PostgreSQL/Oracle)
SELECT dept_id,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
GROUP BY dept_id;
```

## Q39. Scenario: Write a query to identify the top 3 highest-paid employees per department.

```sql
WITH ranked AS (
    SELECT emp_name, dept_id, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT emp_name, dept_id, salary
FROM ranked
WHERE rnk <= 3;
```

## Q40. Scenario: Given a `logins` table, find users who logged in on 3 or more consecutive days.

```sql
WITH numbered AS (
    SELECT user_id, login_date,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn
    FROM (SELECT DISTINCT user_id, login_date FROM logins) t
),
grouped AS (
    SELECT user_id, login_date,
           login_date - (rn * INTERVAL '1 day') AS grp
    FROM numbered
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end,
       COUNT(*) AS streak_length
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) >= 3
ORDER BY user_id, streak_start;
```

---

## Nth Highest Salary — All Approaches

This is one of the most frequently asked SQL scenario-based interview questions. Below are multiple approaches, from most portable to most efficient.

## Approach 1: Using `LIMIT` / `OFFSET` (simplest, works on distinct values)

```sql
-- Nth highest salary (replace N with the desired rank, e.g. 3 for 3rd highest)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET N-1;

-- Example: 3rd highest salary
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;
```

## Approach 2: Using a Correlated Subquery (portable across almost all RDBMS)

```sql
-- Nth highest salary: count how many DISTINCT salaries are greater
SELECT DISTINCT salary
FROM employees e1
WHERE (N - 1) = (
    SELECT COUNT(DISTINCT salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);

-- Example: 2nd highest salary
SELECT DISTINCT salary
FROM employees e1
WHERE 1 = (
    SELECT COUNT(DISTINCT salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);
```

## Approach 3: Using `DENSE_RANK()` (best practice — correctly handles duplicate salaries)

```sql
WITH ranked_salaries AS (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary
FROM ranked_salaries
WHERE rnk = N;

-- Example: 5th highest salary
WITH ranked_salaries AS (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary
FROM ranked_salaries
WHERE rnk = 5;
```

## Approach 4: Nth highest salary PER DEPARTMENT (common follow-up)

```sql
WITH ranked_salaries AS (
    SELECT dept_id, emp_name, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT dept_id, emp_name, salary
FROM ranked_salaries
WHERE rnk = 2;   -- 2nd highest salary in each department
```

## Approach 5: MySQL versions without window function support (legacy MySQL < 8.0)

```sql
SELECT salary
FROM (
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT N
) AS top_n
ORDER BY salary ASC
LIMIT 1;
```

## `RANK()` vs `DENSE_RANK()` for this problem — why it matters

If two employees are tied for the highest salary:
- `RANK()` would make the next distinct salary rank **3** (skipping 2) — likely wrong if the interviewer means "the 2nd distinct highest value."
- `DENSE_RANK()` correctly assigns the next distinct salary rank **2** — this is almost always the intended behavior for "Nth highest salary" questions.

```sql
SELECT salary,
       RANK()       OVER (ORDER BY salary DESC) AS rank_val,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank_val
FROM employees;
```

---

## Quick Reference Cheat Sheet

| Concept | Key Syntax |
|---|---|
| Filter rows | `WHERE` |
| Filter groups | `HAVING` |
| Remove duplicates | `DISTINCT` |
| Combine result sets | `UNION` / `UNION ALL` |
| Row-level ranking | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` |
| Compare to adjacent row | `LAG()`, `LEAD()` |
| Running/cumulative totals | `SUM() OVER (ORDER BY ...)` |
| Reusable named subquery | `WITH cte_name AS (...)` |
| Hierarchical data | `WITH RECURSIVE ...` |
| Conditional aggregation | `CASE WHEN ... THEN ... END` inside `SUM()`/`COUNT()` |
| Exact median | `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col)` |
| Query logical order | `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` |

---

## Tips for the Interview

- Always clarify whether duplicate values should be treated as one rank or multiple (this changes `RANK()` vs `DENSE_RANK()` vs raw row counts).
- State the time complexity / index usage of your query if asked to optimize.
- If unsure of the exact SQL dialect (MySQL, PostgreSQL, SQL Server, Oracle), mention the dialect-specific syntax differences (e.g., `LIMIT/OFFSET` vs `TOP` vs `FETCH FIRST`).
- Practice writing the same query in more than one way — interviewers often ask "can you do this without a window function?"
