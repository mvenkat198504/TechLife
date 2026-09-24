---
id: react-react-list-keys-props-jsx-event-handling-routing
slug: react-list-keys-props-jsx-event-handling-routing
title: React List & Keys, props & JSX, Event Handling, Routing
categoryId: react
subcategory: react-lists-keys-props
difficulty: Intermediate
tags:
  - Lists & Keys
  - Props & JSX
  - Event Handling
  - Routing
summary: Experienced-candidate React interview set covering Lists & Keys, Props & JSX, Event Handling
updatedAt: 2026-09-24
status: published
thumbnail: ""
videos: []
resources: []
---

# React List & Keys, props & JSX, Event Handling, Routing

# react-Lists-Keys-Props-JSX-Event Handling-Routing, and State Management

## 1.Find length of each element in a new array?

![react-list1.png](/images/react/react-lists-keys-props/react-list1.png)

## 2.Find square root of every element & store in a new array

![react-list2.png](/images/react/react-lists-keys-props/react-list2.png)

## 3.How will you render alist ? Or How to render a collection of values?

![react-list3.png](/images/react/react-lists-keys-props/react-list3.png)

## 4.What is the purpose of the key property ? Or Why does “this each child in a list should have a unique key prop” error occurs?

The Reason why need the unique key identifier is : When React needs to change that particular item,then there has to be a unique value to refer the element whenever there is a change or addition to the list
It need to refer the individual item internally & that’s where the key will be referred

![react-list4.png](/images/react/react-lists-keys-props/react-list4.png)

## 5.Should you use the index of map() method i.e. the index of array as a key attribute?

**Absolutely No ! **

As the React official document says that the best way to pick a key is to ause a string that uniquely identifies a list item among is siblings & it has to be a stable identity.
Index is not a stable identity for every item.

Generally we give the value for the key attribute is defined inside for e.g an ID froma database, or may be some stable identity you can take. It is not adivisable to take the index or array item as a unique identifier

## 6.How do you access the content of the component? Or What does props.children property do?
![react-list5.png](/images/react/react-lists-keys-props/react-list5.png)

## 7. When do you face the error- “Adjacent JSX elements must be wrapped in an enclosing tag”

When the JSX is returning more than one elements, on has to pass all the elements with a container or else it will show an error.

## 8.Explain the purpose of  React.Fragment

![react-list6.png](/images/react/react-lists-keys-props/react-list6.png)

## 9. What is a SyntheticEvent in React JS?

A **SyntheticEvent** is a wrapper around the native browser event object & that is passed to every function auomatically

![react-list7.png](/images/react/react-lists-keys-props/react-list7.png)

## 10.How do you upate the state value when the data entered in the textbox?

![react-list8.png](/images/react/react-lists-keys-props/react-list8.png)

## 11.How will you prevent the default behaviour of an element? Or Can you use return false with an event to prevent the default behaviour?

![react-list9.png](/images/react/react-lists-keys-props/react-list9.png)

## 12.How will you update the individual value of a state inside an object?

![react-list10.png](/images/react/react-lists-keys-props/react-list10.png)

## 13.Can you directly render an object?

![react-list11.png](/images/react/react-lists-keys-props/react-list11.png)

## 14. Why is updating state with “functional update” syntax better?

The main reason to do so is React does not update the state immediately as it has its own method or schedule to update the states.

In case there are many updates of the state happening at the same time, it may refer to an incorrect copy of a state

![react-list12.png](/images/react/react-lists-keys-props/react-list12.png)

## 15.What is conditional rendering?

Conditional rendering is all about rendering or showing only specific components depending on a specific condition-> this is very useful for day to day development

## 16. Explain the JSX element variable syntax and the concept

![react-list13.png](/images/react/react-lists-keys-props/react-list13.png)
## 17.Are the URLs and Routes same?
**No**

## 18. How will you create a route which can take dynamic parameters?

![react-list14.png](/images/react/react-lists-keys-props/react-list14.png)

## 19.Explain the way to get the router parameter value passed in the URL? Or Explain the purpose of **useParams()** hook

![react-list15.png](/images/react/react-lists-keys-props/react-list15.png)

## 20.How will you implement nested routes with version 6?

![react-list16.png](/images/react/react-lists-keys-props/react-list16.png)

## 21. What is the purpose of “index” attribute?

![react-list17.png](/images/react/react-lists-keys-props/react-list17.png)

## 22.Multi-page application (MPA) vs Single-Page application (SPA)

![react-list18.png](/images/react/react-lists-keys-props/react-list18.png)

## 23.How do you implement Single-Page application  (SPA)?

![react-list19.png](/images/react/react-lists-keys-props/react-list19.png)

%%%
---
id: react-react-list-keys-props-jsx-event-handling-routing_002
slug: react-list-keys-props-jsx-event-handling-routing
title: React List & Keys, props & JSX, Event Handling, Routing With Coding Example
categoryId: react
subcategory: react-lists-keys-props
difficulty: Intermediate
tags:
  - Lists & Keys
  - Props & JSX
  - Event Handling
  - Routing
summary: Experienced-candidate React interview set covering Lists & Keys, Props & JSX, Event Handling
updatedAt: 2026-09-24
status: published
thumbnail: ""
videos: []
resources: []
---

# React Interview Questions & Answers for Experienced Developers

## React Interview Questions & Answers for Experienced Developers

Topics covered:

-   Lists & Keys
-   Props & JSX
-   Event Handling
-   Routing
-   State Management
-   Experienced-Level Scenario Questions

------------------------------------------------------------------------

## 1. React Lists & Keys

### Q1. How do you render a list in React?

Usually with JavaScript `map()`.

``` jsx
const employees = [
  { id: 1, name: "Venkat" },
  { id: 2, name: "Kumar" },
  { id: 3, name: "John" }
];

function EmployeeList() {
  return (
    <ul>
      {employees.map(employee => (
        <li key={employee.id}>
          {employee.name}
        </li>
      ))}
    </ul>
  );
}
```

**Interview Answer:** React commonly uses `map()` to transform an array
of data into JSX elements. Each element should have a stable and unique
`key`.

------------------------------------------------------------------------

### Q2. Why are keys important in React?

Keys help React identify which list items have been added, removed,
moved, or updated.

``` jsx
{users.map(user => (
  <User key={user.id} user={user} />
))}
```

React uses keys during reconciliation to associate existing component
instances with the corresponding items in the next render.

**Important:** A `key` should be unique among siblings, not necessarily
globally unique.

------------------------------------------------------------------------

### Q3. Why should we avoid using the array index as a key?

``` jsx
{users.map((user, index) => (
  <User key={index} user={user} />
))}
```

If the list is reordered, filtered, inserted into, or deleted from,
indexes can change.

``` text
Before:
0 -> Venkat
1 -> Ram
2 -> John

After deleting Venkat:
0 -> Ram
1 -> John
```

React may associate existing component state with the wrong data.

Prefer:

``` jsx
<User key={user.id} user={user} />
```

**Interview Answer:** Index is acceptable mainly for a truly static list
that will never reorder, insert, or delete items. Stable IDs are
preferable.

------------------------------------------------------------------------

### Q4. Can we access `key` inside a child component?

No.

``` jsx
<User key={user.id} user={user} />
```

Inside `User`:

``` jsx
function User(props) {
  console.log(props.key); // undefined
}
```

`key` is a special React attribute and is not passed as a normal prop.

If the child needs the ID:

``` jsx
<User
  key={user.id}
  userId={user.id}
  user={user}
/>
```

------------------------------------------------------------------------

### Q5. What happens if two elements have the same key?

React expects sibling keys to be unique. Duplicate keys can cause
incorrect component reuse and unpredictable UI/state behavior, and React
normally reports a warning.

``` jsx
// Bad
<User key={1} />
<User key={1} />
```

------------------------------------------------------------------------

### Q6. Scenario: API returns users. How would you render active users only?

``` jsx
function UserList({ users }) {
  return (
    <ul>
      {users
        .filter(user => user.isActive)
        .map(user => (
          <li key={user.id}>
            {user.name}
          </li>
        ))}
    </ul>
  );
}
```

This tests your understanding of JavaScript array operations together
with JSX.

------------------------------------------------------------------------

##  2. Props & JSX

### Q7. What are props in React?

Props are inputs passed from a parent component to a child component.

``` jsx
function Parent() {
  return <Employee name="Venkat" role="Tech Lead" />;
}

function Employee({ name, role }) {
  return (
    <div>
      {name} - {role}
    </div>
  );
}
```

Data normally flows:

``` text
Parent
   ↓ props
Child
```

Props should be treated as **read-only** by the receiving component.

------------------------------------------------------------------------

### Q8. What is the difference between props and state?

| Props | State |
|---|---|
| Passed into a component | Managed by the component/store |
| Read-only to receiver | Updated through state APIs |
| Used for component configuration/data | Used for changing application/UI data |
| Changes originate outside receiving component | Changes can originate from user/API/application events |

Example:

``` jsx
function Counter({ title }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2>{title}</h2>
      <button onClick={() => setCount(c => c + 1)}>
        {count}
      </button>
    </>
  );
}
```

Here `title` is a prop and `count` is state.

------------------------------------------------------------------------

### Q9. What is JSX?

JSX is syntax that allows us to describe React elements using HTML-like
markup inside JavaScript.

``` jsx
const element = <h1>Hello Venkat</h1>;
```

Conceptually, JSX is transformed into React element creation calls by
the build tooling.

Modern JSX transformation does not necessarily require:

``` jsx
import React from "react";
```

in every JSX file.

------------------------------------------------------------------------

### Q10. Can JSX return multiple elements?

Yes, but they need to form one returned tree.

Using a wrapper:

``` jsx
return (
  <div>
    <Header />
    <Content />
  </div>
);
```

Using a Fragment:

``` jsx
return (
  <>
    <Header />
    <Content />
  </>
);
```

Fragments avoid introducing an unnecessary DOM element.

------------------------------------------------------------------------

### Q11. How do you pass an object as a prop?

``` jsx
const employee = {
  id: 1,
  name: "Venkat"
};

<Employee employee={employee} />
```

Child:

``` jsx
function Employee({ employee }) {
  return <div>{employee.name}</div>;
}
```

------------------------------------------------------------------------

### Q12. How can a child component communicate with its parent?

A common pattern is passing a callback as a prop.

``` jsx
function Parent() {
  const handleSave = data => {
    console.log(data);
  };

  return <Child onSave={handleSave} />;
}

function Child({ onSave }) {
  return (
    <button onClick={() => onSave("Saved successfully")}>
      Save
    </button>
  );
}
```

Flow:

``` text
Parent
  ↓ callback prop
Child
  ↓ invokes callback
Parent handles data
```

This is often called **lifting the event/state up**.

------------------------------------------------------------------------

### Q13. What is prop drilling?

Prop drilling occurs when data has to be passed through several
intermediate components that do not actually need it.

``` text
App
 ↓ user
Layout
 ↓ user
Dashboard
 ↓ user
Profile
```

Possible alternatives include:

-   Context API
-   Component composition
-   Zustand
-   Redux Toolkit
-   Other state-management solutions

**Experienced Answer:** Prop drilling itself is not automatically bad.
For a small number of levels, props may remain the simplest solution.

------------------------------------------------------------------------

## 3. Event Handling

### Q14. How does event handling work in React?

``` jsx
function SaveButton() {
  const handleClick = () => {
    console.log("Saved");
  };

  return (
    <button onClick={handleClick}>
      Save
    </button>
  );
}
```

Correct:

``` jsx
onClick={handleClick}
```

Avoid:

``` jsx
onClick={handleClick()}
```

The second executes the function during rendering rather than supplying
it as the event handler.

------------------------------------------------------------------------

### Q15. How do you pass parameters to an event handler?

``` jsx
const handleDelete = id => {
  console.log(id);
};

<button onClick={() => handleDelete(user.id)}>
  Delete
</button>
```

------------------------------------------------------------------------

### Q16. How do you access the event object?

``` jsx
function handleChange(event) {
  console.log(event.target.value);
}

<input onChange={handleChange} />
```

Or:

``` jsx
const handleChange = e => {
  setName(e.target.value);
};
```

------------------------------------------------------------------------

### Q17. What is `preventDefault()`?

It prevents the browser's default behavior.

``` jsx
function handleSubmit(e) {
  e.preventDefault();

  console.log("Submitting using React");
}

<form onSubmit={handleSubmit}>
  <button type="submit">Submit</button>
</form>
```

------------------------------------------------------------------------

### Q18. What is `stopPropagation()`?

It prevents the event from propagating further through the event
propagation path.

``` jsx
function Parent() {
  return (
    <div onClick={() => console.log("Parent")}>
      <button
        onClick={e => {
          e.stopPropagation();
          console.log("Button");
        }}
      >
        Click
      </button>
    </div>
  );
}
```

Without `stopPropagation()`, clicking the button can also trigger the
parent click handler through bubbling.

------------------------------------------------------------------------

### Q19. How do you handle multiple form inputs with one handler?

``` jsx
const [form, setForm] = useState({
  name: "",
  email: ""
});

const handleChange = e => {
  const { name, value } = e.target;

  setForm(prev => ({
    ...prev,
    [name]: value
  }));
};
```

JSX:

``` jsx
<input
  name="name"
  value={form.name}
  onChange={handleChange}
/>

<input
  name="email"
  value={form.email}
  onChange={handleChange}
/>
```

This is a common coding interview question.

------------------------------------------------------------------------

## 4. React Routing

### Q20. What is routing in a React application?

Routing maps URLs to application UI/components without requiring
traditional full-page navigation for each route.

Using React Router:

``` jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/users" element={<Users />} />
  <Route path="/users/:id" element={<UserDetails />} />
</Routes>
```

Typical URLs:

``` text
/
/users
/users/10
```

------------------------------------------------------------------------

### Q21. What is the difference between `<Link>` and `<a>`?

React Router:

``` jsx
<Link to="/users">Users</Link>
```

Traditional HTML:

``` jsx
<a href="/users">Users</a>
```

For internal SPA navigation, `Link` integrates with the client-side
router and generally avoids a full document reload.

An `<a>` is still appropriate for external destinations and other normal
browser navigation use cases.

------------------------------------------------------------------------

### Q22. How do you read route parameters?

Route:

``` jsx
<Route
  path="/users/:id"
  element={<UserDetails />}
/>
```

Component:

``` jsx
import { useParams } from "react-router-dom";

function UserDetails() {
  const { id } = useParams();

  return <h2>User ID: {id}</h2>;
}
```

URL:

``` text
/users/101
```

`id` becomes `"101"`.

------------------------------------------------------------------------

### Q23. How do you navigate programmatically?

``` jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    // login logic
    navigate("/dashboard");
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

A common real-world example is redirecting after login, save, or form
submission.

------------------------------------------------------------------------

### Q24. How do you create protected routes?

``` jsx
function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}
```

Usage:

``` jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

For a production application, authentication state would normally be
managed through an auth provider/store rather than repeatedly reading
`localStorage`.

------------------------------------------------------------------------

### Q25. What are nested routes?

Example URL structure:

``` text
/studies
/studies/100
/studies/100/documents
```

A parent layout can render child route content through `<Outlet />`.

``` jsx
function StudyLayout() {
  return (
    <>
      <StudyHeader />
      <Outlet />
    </>
  );
}
```

Useful structure:

``` text
Dashboard
 ├── Overview
 ├── Documents
 ├── Users
 └── Settings
```

------------------------------------------------------------------------

## 5. State Management

### Q26. What is state in React?

State represents data that can change and affect what the component
renders.

``` jsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    {count}
  </button>
);
```

Updating state causes React to schedule a re-render.

------------------------------------------------------------------------

### Q27. Why shouldn't we modify state directly?

Bad:

``` jsx
user.name = "Venkat";
setUser(user);
```

Better:

``` jsx
setUser(prev => ({
  ...prev,
  name: "Venkat"
}));
```

React state should be treated as immutable. Creating a new reference
makes change detection and state reasoning safer.

------------------------------------------------------------------------

### Q28. Why use the functional form of state update?

Instead of:

``` jsx
setCount(count + 1);
```

Use:

``` jsx
setCount(prev => prev + 1);
```

when the new value depends on the previous value.

``` jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
```

Each update works from the latest queued state. This is particularly
important because React can batch state updates.

------------------------------------------------------------------------

### Q29. What is lifting state up?

If two sibling components need the same selected employee, move the
shared state to their nearest common parent.

``` text
             EmployeePage
            selectedEmployee
             /          \
            ↓            ↓
     EmployeeList   EmployeeDetails
```

Example:

``` jsx
function EmployeePage() {
  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  return (
    <>
      <EmployeeList
        onSelect={setSelectedEmployee}
      />

      <EmployeeDetails
        employee={selectedEmployee}
      />
    </>
  );
}
```

------------------------------------------------------------------------

### Q30. When would you use `useState` vs `useReducer`?

Use `useState` for relatively simple independent state:

``` jsx
const [name, setName] = useState("");
```

Use `useReducer` when state transitions are more complex or multiple
fields change together.

``` jsx
const initialState = {
  loading: false,
  data: [],
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return {
        ...state,
        loading: true
      };

    case "SUCCESS":
      return {
        loading: false,
        data: action.payload,
        error: null
      };

    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}
```

Usage:

``` jsx
const [state, dispatch] =
  useReducer(reducer, initialState);
```

------------------------------------------------------------------------

### Q31. Context API vs Redux --- when would you use each?

**Context** is useful for values that many descendants need, such as:

-   Authentication
-   Theme
-   Locale
-   Feature configuration

Example:

``` jsx
<AuthContext.Provider value={user}>
  <App />
</AuthContext.Provider>
```

Redux Toolkit or another external store becomes useful when an
application has more substantial shared client state, complex
transitions, debugging requirements, middleware, or many unrelated
consumers.

**Experienced Interview Answer:**

> I don't choose Redux simply because an application is large. I first
> identify what kind of state I'm managing and who needs it.

------------------------------------------------------------------------

### Q32. What types of state should an experienced developer distinguish?

``` text
Local UI State
     ↓
useState / useReducer

Shared Client State
     ↓
Context / Redux / Zustand

Server State
     ↓
TanStack Query

URL State
     ↓
React Router

Form State
     ↓
React Hook Form / component state
```

For example, API results do not automatically need to be copied into
Redux.

With TanStack Query:

``` jsx
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: getUsers
});
```

It provides capabilities around caching, refetching, request state, and
server-state synchronization.

------------------------------------------------------------------------

## 6. Experienced-Level Scenario Questions

### Q33. Your component contains 10,000 records and rendering is slow. What would you do?

First investigate the actual bottleneck, then consider:

-   Pagination
-   List virtualization
-   Avoiding unnecessary re-renders
-   Stable keys
-   Memoization where profiling shows value
-   Server-side filtering/search for large remote datasets

Virtualization libraries can render only the currently visible rows
instead of thousands of DOM nodes.

------------------------------------------------------------------------

### Q34. Parent re-renders and all child components re-render. How would you optimize it?

Possible tools include `React.memo()`:

``` jsx
const Employee = React.memo(function Employee({ employee }) {
  return <div>{employee.name}</div>;
});
```

`useCallback()` for stable callback references when that matters:

``` jsx
const handleDelete = useCallback(id => {
  deleteEmployee(id);
}, []);
```

`useMemo()` for expensive calculations:

``` jsx
const filteredUsers = useMemo(
  () => users.filter(u => u.active),
  [users]
);
```

**Experienced Answer:** Profile first rather than applying memoization
everywhere.

------------------------------------------------------------------------

### Q35. How would you manage authentication state in a React enterprise application?

Typical flow:

``` text
Login
  ↓
Authentication API
  ↓
Auth Provider / Store
  ↓
Authenticated user + authorization state
  ↓
Protected Routes
  ↓
API Client / Axios interceptor
```

Example:

``` jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async credentials => {
    const response = await loginApi(credentials);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

In real applications, token storage, refresh-token handling, session
expiry, XSS/CSRF considerations, and server-side authorization all
matter.

------------------------------------------------------------------------

### Q36. API data is needed by five components. Would you put it in Redux?

Not automatically.

First determine whether the data is **server state** or **client
state**.

For server/API state, TanStack Query is often a natural solution:

``` jsx
useQuery({
  queryKey: ["employees"],
  queryFn: getEmployees
});
```

For shared client-side state, Redux Toolkit, Context, Zustand, or
another state-management approach may be appropriate.

This distinction is very useful in experienced React interviews.

------------------------------------------------------------------------

### Q37. How would you explain React data flow in one minute?

> React primarily follows one-way data flow. A parent passes data to
> child components through props. Components maintain changing local
> data through state. Child components can communicate changes upward by
> invoking callbacks passed through props. When state changes, React
> re-renders the affected component tree and reconciles the new element
> structure with the previous one. For cross-cutting client state we can
> use Context or a state store, while server state is often better
> handled through a query/cache library.

------------------------------------------------------------------------

##  Quick Interview Revision

``` text
JSX
 ↓
Components
 ↓
Props
 ↓
Events
 ↓
State
 ↓
Re-render
 ↓
Lists + Keys
 ↓
Routing
 ↓
Shared State
 ↓
Server State
```

## Interview Tip

For an **experienced React interview**, do not stop at definitions.
Explain:

1.  **What** the concept is.
2.  **Why** it is needed.
3.  **When** you would use it.
4.  **What trade-offs** are involved.
5.  Give a **real-world example**.

For example, instead of saying:

> Redux manages state.

A stronger answer is:

> I first separate local UI state, shared client state, URL state, form
> state, and server state; then I select the appropriate
> state-management mechanism.
