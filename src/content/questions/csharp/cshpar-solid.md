---
id: csharp-solid-001
slug: soliprincple1
title: SOLID Principles C#
categoryId: csharp
subcategory: OOPS
difficulty: Basic
tags:
  - middleware
  - request-pipeline
  - aspnet-core
summary: Understand custom middleware with a production example.
updatedAt: 2026-08-25
status: published
thumbnail: ""
videos: []
resources: []
---

# SOLID Principles C#

## SOLID
S-Single Responsibility Principle (SRP)
O-Open/Closed Principle (OCP)
L-Liskov Substitution Principle (LSP)
I-Interface Segregation Principle (ISP)
D-Dependency Inversion Principle (DIP)
Below is an interview-ready Payroll Management System example for SOLID principles.
## 1. SRP — Single Responsibility Principle ##
**Meaning:** One class should do one job only.
Better Design

Separate each responsibility.
## Code example
```
public class SalaryCalculator
{
    public decimal Calculate(Employee employee)
    {
        return employee.BasicSalary +
               employee.Allowance -
               employee.Deduction;
    }
}

public class PayrollRepository
{
    public void Save(Employee employee, decimal salary)
    {
        // Database operation
    }
}

public class EmailService
{
    public void SendPayslip(Employee employee)
    {
        // Send email
    }
}
```
## Interview answer
In our payroll application, I wouldn't keep salary calculation, database operations, payslip generation, and email notification inside one service. I separate them into SalaryCalculator, **PayrollRepository**, **PayslipGenerator**, and **EmailService**. This follows SRP because each class has only one reason to change.

## 2. O — Open/Closed Principle (OCP)

Definition: Software entities should be open for extension but closed for modification.
Imagine we have different employee types:
- Permanent employee
- Contract employee
- Consultant

Better Design

Create an abstraction.
## Code example
```
//Create an abstraction.
public interface ISalaryCalculator
{
    decimal CalculateSalary();
}
//Permanent employee:
public class PermanentEmployeeSalary : ISalaryCalculator
{
    public decimal BasicSalary { get; set; }
    public decimal HRA { get; set; }

    public decimal CalculateSalary()
    {
        return BasicSalary + HRA;
    }
}
//Contract employee:
public class ContractEmployeeSalary : ISalaryCalculator
{
    public int HoursWorked { get; set; }
    public decimal HourlyRate { get; set; }

    public decimal CalculateSalary()
    {
        return HoursWorked * HourlyRate;
    }
}
// Consultant:
public class ConsultantSalary : ISalaryCalculator
{
    public int DaysWorked { get; set; }
    public decimal DailyRate { get; set; }

    public decimal CalculateSalary()
    {
        return DaysWorked * DailyRate;
    }
}
//Now add an intern:
public class InternSalary : ISalaryCalculator
{
    public decimal Stipend { get; set; }

    public decimal CalculateSalary()
    {
        return Stipend;
    }
}
//We didn't modify existing salary calculators.
```
## Interview answer
In payroll, employee categories can have different salary rules. Instead of maintaining a large if/else or switch statement, I use an ISalaryCalculator abstraction. New employee salary types can be introduced by creating another implementation without changing existing tested code. This follows OCP.

## 3. L — Liskov Substitution Principle (LSP) ##
Definition: A derived class should be usable anywhere its base class is expected without breaking application behavior.

Consider this design:
Better Design

Only employees eligible for bonuses should implement bonus behavior.

## Code example
```
public abstract class Employee
{
    public string Name { get; set; }
}

//Create:

public interface IBonusEligible
{
    decimal CalculateBonus();
}

// Permanent employee:

public class PermanentEmployee :
    Employee,
    IBonusEligible
{
    public decimal BasicSalary { get; set; }

    public decimal CalculateBonus()
    {
        return BasicSalary * 0.10m;
    }
}
//Contract employee:

public class ContractEmployee : Employee
{
    public decimal HourlyRate { get; set; }
}

//Now bonus processing accepts only eligible employees:

public void ProcessBonus(IBonusEligible employee)
{
    decimal bonus = employee.CalculateBonus();

    // Process bonus
}

```
## Interview answer
A common LSP violation in payroll is putting CalculateBonus() in the base Employee class even though contract employees aren't eligible for bonuses. The contract employee then throws NotSupportedException. Instead, I introduce an IBonusEligible interface and implement it only for employee types that support bonus calculation.

## 4. I — Interface Segregation Principle (ISP) ##
Definition: Clients should not be forced to depend on methods they don't use.
Better Design

Create smaller interfaces.
## Code example
```
public interface ISalaryEligible
{
    decimal CalculateSalary();
}
public interface IBonusEligible
{
    decimal CalculateBonus();
}
public interface IOvertimeEligible
{
    decimal CalculateOvertime();
}
public interface ICommissionEligible
{
    decimal CalculateCommission();
}

//Permanent employee:

public class PermanentEmployee :
    ISalaryEligible,
    IBonusEligible,
    IOvertimeEligible
{
    public decimal CalculateSalary()
    {
        return 50000;
    }

    public decimal CalculateBonus()
    {
        return 5000;
    }

    public decimal CalculateOvertime()
    {
        return 2000;
    }
}

//Sales employee:

public class SalesEmployee :
    ISalaryEligible,
    ICommissionEligible
{
    public decimal CalculateSalary()
    {
        return 40000;
    }

    public decimal CalculateCommission()
    {
        return 15000;
    }
}
```
## Interview answer
In payroll, not every employee supports bonus, overtime, commission, PF, or gratuity. Instead of creating one large employee interface, I create focused interfaces such as IBonusEligible, IOvertimeEligible, and ICommissionEligible. Classes implement only the behavior they actually require.

## 5. D — Dependency Inversion Principle (DIP)
Definition: High-level modules should not depend directly on low-level modules. Both should depend on abstractions.
Better Design

Create an abstraction.
## Code example
```
public interface INotificationService
{
    void Send(string message);
}
//Email implementation:
public class EmailNotificationService :
    INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine(
            $"Email sent: {message}");
    }
}
//SMS implementation:
public class SmsNotificationService :
    INotificationService
{
    public void Send(string message)
    {
        Console.WriteLine(
            $"SMS sent: {message}");
    }
}
//Payroll processor:
public class PayrollProcessor
{
    private readonly INotificationService
        _notificationService;

    public PayrollProcessor(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void ProcessPayroll()
    {
        // Salary calculation
        // Tax calculation
        // Payroll generation

        _notificationService.Send(
            "Your payroll has been processed.");
    }
}
//ASP.NET Core Dependency Injection:
builder.Services.AddScoped<
    INotificationService,
    EmailNotificationService>();

builder.Services.AddScoped<PayrollProcessor>();
// Now the dependency can easily be changed:
builder.Services.AddScoped<
    INotificationService,
    SmsNotificationService>();
```
## Interview answer
In our payroll system, the payroll processing service should not directly create EmailService, repositories, or external services. I inject abstractions such as INotificationService and IPayrollRepository. ASP.NET Core's built-in DI container resolves the concrete implementations. This reduces coupling and makes unit testing much easier.

## Putting All SOLID Principles Together
A more realistic service could look like this:
## Code example
```
public class PayrollProcessor
{
    private readonly ISalaryCalculator _salaryCalculator;
    private readonly IPayrollRepository _repository;
    private readonly INotificationService _notificationService;

    public PayrollProcessor(
        ISalaryCalculator salaryCalculator,
        IPayrollRepository repository,
        INotificationService notificationService)
    {
        _salaryCalculator = salaryCalculator;
        _repository = repository;
        _notificationService = notificationService;
    }

    public async Task ProcessAsync(Employee employee)
    {
        decimal salary =
            _salaryCalculator.CalculateSalary(employee);

        await _repository.SaveAsync(
            employee.Id,
            salary);

        await _notificationService.SendAsync(
            employee.Email,
            $"Payroll processed. Net Salary: {salary}");
    }
}

//ASP.NET Core DI:

builder.Services.AddScoped<
    ISalaryCalculator,
    SalaryCalculator>();

builder.Services.AddScoped<
    IPayrollRepository,
    PayrollRepository>();

builder.Services.AddScoped<
    INotificationService,
    EmailNotificationService>();

builder.Services.AddScoped<PayrollProcessor>();
```
## Easy Way to Remember SOLID
<!--
/*First row = header, second row must be the ---|--- separator, remaining rows = data.
Each row must start/end with |.
Inline code like `next()` works inside cells.*/
-->

|Principle	|Payroll example	|Remember as|
|---|---|---|
|SRP|	Separate calculation, DB, payslip and email	|One job per class|
|OCP|	Add new salary type without modifying existing calculators	|Extend, don't modify|
|LSP|	Contract employee shouldn't be forced to support bonus	|Child must safely replace parent|
|ISP|	Separate Bonus, Overtime and Commission interfaces	|Small focused interfaces|
|DIP|	PayrollProcessor depends on INotificationService	|Depend on abstractions|

## A strong experienced-level interview summary is:
“In a payroll application, I use SRP to separate salary calculation, persistence, payslip generation and notifications. I use OCP so that new payroll rules or employee types can be introduced through new implementations rather than modifying existing logic. I follow LSP by ensuring derived employee types don't expose unsupported operations. I use ISP to keep payroll capabilities such as bonus, overtime and commission in focused interfaces. Finally, I use DIP and ASP.NET Core dependency injection so business services depend on abstractions such as repositories and notification interfaces rather than concrete implementations.”