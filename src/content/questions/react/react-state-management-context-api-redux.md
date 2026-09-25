---
id: react-react-state-management-context-api-redux
slug: react-state-management-context-api-redux
title: React State Management (Context API, Redux)
categoryId: react
subcategory: React State Management
difficulty: Intermediate
tags:
  - React State Management
  - Context API
  - Redux
summary: React State Management (Context API, Redux)
updatedAt: 2026-09-25
status: published
thumbnail: ""
videos: []
resources: []
---

# React State Management (Context API, Redux)

# React State Management (Context API, Redux)
## State Management Flow
![state_management_1.png](/images/react/react-state-management/state_management_1.png)
![state_management_2.png](/images/react/react-state-management/state_management_2.png)

## 1. What is prop-drilling

**Prop drilling** (also known as "threading props" or "component chaining") is the process of passing data from a higher-level parent component down to a deeply nested child component through multiple layers of intermediary components.

It occurs when intermediate components in the tree do not actually need the data themselves, but must receive and forward the props solely to deliver them to the child component that does

![state_management_3.png](/images/react/react-state-management/state_management_3.png)

## 2. Is it always good to avoid prop-drilling pattern? (Should you put the global state all the time using Context API or redux?)

**No, avoiding prop drilling is not always necessary**, and putting all state into global tools like the Context API or Redux is often a bad practice.

**When Prop Drilling is Good**

- **Shallow Nesting:** Passing props down 1 or 2 levels is clear and easy to follow
- **Component Reusability:** Components that take explicit props are pure and easier to reuse anywhere in your app without depending on a global provider.
- **Explicit Data Flow:** You can easily see where data comes from by looking at the parent component

**When to Use Context API or Redux**

- **Global UI Settings:** Use the Context API for low-frequency updates like current themes, user authentication, or preferred language

- **Complex or High-Frequency State:** Use dedicated state libraries like Redux or Zustand for heavy data caches, complex application logic, or frequently changing values that would trigger massive re-renders if placed in a single root context.
- **Deep Component Trees:** Use global state when passing data requires drilling through 4 or more intermediate layers that do not care about the data

![state_management_4.png](/images/react/react-state-management/state_management_4.png)
![state_management_5.png](/images/react/react-state-management/state_management_5.png)

So generally, the practice is to make only those things global which is shared among various components
When its getting complex with various levels, then certainly you can choose to make few data pieces global.

## 3.ContextAPI Setup
There are 3 main steps to setup Context API:

1.Create Context
2.Provider
3.Consumer

**Step 1: Create the Context and Provider**

Create a dedicated file for your context (e.g., src/context/ThemeContext.js). In this file, you will initialize the context and build a custom wrapper component that manages the shared state.

```javscript
import { createContext, useState, useContext } from 'react';

// 1. Create the Context object
const ThemeContext = createContext();

// 2. Create the Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // The 'value' prop contains everything available to child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create a custom hook for easy consumption
export function useTheme() {
  return useContext(ThemeContext);
}

```

**Step 2: Wrap Your Application**

To make this global state accessible everywhere, wrap your root component (usually App or index) inside your newly created provider.

```javascript
// src/index.js or src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; // Import provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

```

**Step 3: Consume Context Data in Components**

Now, any component nested inside ThemeProvider can instantly access the shared state and functions using the custom useTheme hook

```javascript
// src/components/ThemeButton.js
import { useTheme } from '../context/ThemeContext'; // Import your custom hook

export default function ThemeButton() {
  // Extract values directly from context
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff'
      }}
    >
      Current Theme: {theme} (Click to toggle)
    </button>
  );
}

```

## Modern Context API (useContext() hook)

The **React Context API** coupled with the useContext hook is a built-in mechanism designed to share global data (like themes, user authentication, or language settings) across a component tree. It natively solves the problem of prop drilling, which occurs when you are forced to pass data down through multiple layers of intermediate components that do not actually need it.

** 1. Create the Context**

Initialize the context using createContext(). You can pass an optional default value used only if a component tries to read context without being wrapped in a provider

```javascript
import { createContext } from 'react';

// Creates the context object
export const ThemeContext = createContext('light'); 

```
**2. Provide the Value**

Wrap your component tree inside the <Context.Provider> component and supply the global data via the mandatory value prop

```javascript
import { useState } from 'react';
import { ThemeContext } from './ThemeContext';

export default function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

```

**3. Consume the Value**

Inside any nested child component, pull the value directly using the useContext hook.
```javascript
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Dashboard() {
  // Directly subscribes to changes; skips prop drilling entirely!
  const theme = useContext(ThemeContext); 

  return <div className={`box ${theme}`}>Current Theme: {theme}</div>;
}

```
**🛠️ Modern Pattern: The Custom Provider & Hook**

In modern production applications, it is standard practice to bundle the context, provider logic, and an abstraction hook into a single cohesive file. This isolates state management and ensures safety safeguards

```javascript
// AuthContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Create Context
const AuthContext = createContext(undefined);

// 2. Encapsulated Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username) => setUser({ name: username });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Fail-Safe Hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Guard clause against using the hook outside its Provider bounds
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

```

## Will the component using useContext() hook re-render every time the context value changes?

![state_management_6.png](/images/react/react-state-management/state_management_6.png)
![state_management_7.png](/images/react/react-state-management/state_management_7.png)

## Redux Toolkit

Redux is a third-party framework to work with complex state management

1.Which packages do you need to implement redux with react application?
You have install Redux and React-Redux (2 packages need to install) React-Redux is essential library in react application to deal with redux global store.

2.In which scenario do you have to use redux or a similar framework?
When you have an application which has a larger size or data-set-there will be data shared among various components or the entire application.
![state_management_8.png](/images/react/react-state-management/state_management_8.png)

![state_management_9.png](/images/react/react-state-management/state_management_9.png)

## How to create a global store ? Or Explain the usage of redux-createStore() method
![state_management_10.png](/images/react/react-state-management/state_management_10.png)

In Redux, a global store is a central place where application-wide state is stored. Components can read data from the store and dispatch actions to update it.

**Interview answer:** createStore() creates the Redux store. It takes a reducer as its main argument and returns a store containing methods such as getState(), dispatch(), and subscribe().

**1. Basic createStore() example**
```javascript
import { createStore } from "redux";

const initialState = {
  count: 0
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1
      };

    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1
      };

    default:
      return state;
  }
}

// Create global Redux store
const store = createStore(counterReducer);

export default store;
```
The important line is:
```javascript
const store = createStore(counterReducer);
```
Conceptually:
```
Component
    |
    | dispatch(action)
    v
Redux Store
    |
    v
Reducer
    |
    | returns new state
    v
Redux Store updated
    |
    v
React components re-render
```
**2. Important methods of the store**
```
store.getState();
```
Returns the current state:

```
console.log(store.getState());

// { count: 0 }
```
To change state, use dispatch():

```
store.dispatch({
  type: "INCREMENT"
});

console.log(store.getState());

// { count: 1 }
```
You can also listen for changes:
```javascript
store.subscribe(() => {
  console.log("State changed:", store.getState());
});
```

So the three important methods are:

| Method | Purpose |
|---|---|
| `store.getState()` | Gets current state |
| `store.dispatch(action)` | Sends an action to update state |
| `store.subscribe()` | Executes code when state changes |

**3. Using the global store in React**

Usually, the store is provided to the entire React application using Provider.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```
Here:
```
useSelector(state => state.count)
```
reads data from the global store, while:
```
dispatch({ type: "INCREMENT" })
```
requests a state change.

**createStore() vs modern Redux**

For an interview, there is one important point: createStore() represents the traditional Redux approach. In modern Redux applications, Redux Toolkit's configureStore() is the recommended approach.

For example:
```javascript
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export default store;
```
**configureStore()** simplifies store configuration and automatically provides useful defaults such as Redux DevTools support and middleware configuration.

A strong interview response would be:

"createStore() is used to create the centralized Redux store. We pass the root reducer to it, and the returned store exposes methods like getState(), dispatch(), and subscribe(). In React, we expose that store to the component tree using React Redux's Provider. In modern Redux applications, I normally use Redux Toolkit's **configureStore()** instead of the legacy **createStore()** API."

## useSelector()

useSelector() Hook in React Redux

useSelector() is a React Redux hook used to read/select data from the Redux global store inside a functional component.

**Basic syntax**
```javascript
const value = useSelector((state) => state.someValue);
```
For example, suppose the Redux state is:
```javascript
{
  counter: {
    count: 10
  },
  user: {
    name: "Venkat",
    role: "Admin"
  }
}
```
You can access the values like this:
```javascript
import { useSelector } from "react-redux";

function Dashboard() {
  const count = useSelector((state) => state.counter.count);
  const userName = useSelector((state) => state.user.name);

  return (
    <div>
      <h2>Count: {count}</h2>
      <h2>User: {userName}</h2>
    </div>
  );
}
```
How it works
Think of the flow as:
```
Redux Store
     |
     | state changes
     ↓
useSelector()
     |
     | selects required value
     ↓
React Component
     |
     ↓
Re-render (if selected value changed)
```
For example:
```javascript
const count = useSelector((state) => state.counter.count);
Here:
- state → entire Redux store state
- state.counter → counter slice
- state.counter.count → specific value we need
If count changes from 10 to 11, React Redux causes this component to re-render.
useSelector() vs useDispatch()
These two hooks are commonly used together:

| Hook | Purpose |
|---|---|
| `useSelector()` | Read data from Redux store |
| `useDispatch()` | Send an action to Redux store |
```
```javascript
import { useSelector, useDispatch } from "react-redux";

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>{count}</h2>

      <button
        onClick={() => dispatch({ type: "counter/increment" })}
      >
        Increment
      </button>
    </div>
  );
}
```
The flow is:
```
useDispatch()
     ↓
Dispatch Action
     ↓
Reducer updates state
     ↓
Redux Store
     ↓
useSelector() detects selected value changed
     ↓
Component re-renders
```
**Important interview point**

useSelector() subscribes the component to the Redux store. When an action updates the store, React Redux runs the selector again. If the selected result has changed, the component re-renders.

A good short interview answer is:

useSelector() is a React Redux hook used to retrieve data from the Redux store. It takes a selector function, receives the entire Redux state, and returns the selected value. The component subscribes to the store and re-renders when that selected value changes.

A common interview follow-up is “Why can useSelector() cause unnecessary re-renders when returning an object?”—this is important for experienced React interviews.

## Explain the difference between useStore() & useSelector() hooks?

useStore() vs useSelector() in React Redux
Both hooks provide access to Redux, but they serve different purposes.

| Feature | `useSelector()` | `useStore()` |
|---|---|---|
| Purpose | Read/select state | Access the Redux store object directly |
| Returns | Selected state value | Entire Redux store instance |
| Subscribes to state | **Yes** | **No** |
| Re-renders on selected state change | **Yes** | **No, by itself** |
| Common usage | Normal component state reading | Special/advanced cases |
| Recommended for reading state | ✅ Yes | Usually no |

**useSelector()**
useSelector() reads a particular value from the Redux store.
```javascript
import { useSelector } from "react-redux";

function UserProfile() {
  const user = useSelector((state) => state.user);

  return <h2>{user.name}</h2>;
}
```
The important point is that the component subscribes to the Redux store. If the selected user value changes, React Redux re-renders the component.

You can select only what the component needs:

```javascript
const userName = useSelector(
  (state) => state.user.name
);
```
**useStore()**
useStore() gives you the Redux store object itself.
```javascript
import { useStore } from "react-redux";

function UserProfile() {
  const store = useStore();

  const state = store.getState();

  console.log(state);

  return <h2>{state.user.name}</h2>;
}
```
Because you have the actual store, you can call:
```javascript
store.getState();
store.dispatch(...);
store.subscribe(...);
```
But there is an important issue:
```javascript
const store = useStore();
const user = store.getState().user;
```
This does not automatically cause the component to re-render when user changes.

That's why this is normally preferred:
```javascript
const user = useSelector(
  (state) => state.user
);
```
**Simple way to remember**
```
useSelector()
     ↓
"Give me DATA from Redux"
     ↓
state.user.name


useStore()
     ↓
"Give me the Redux STORE itself"
     ↓
store.getState()
store.dispatch()
store.subscribe()
```
**Interview answer**

useSelector() is used to select and read specific data from the Redux store and subscribes the component to relevant store updates. If the selected value changes, the component re-renders.
useStore() returns the Redux store instance itself. It allows direct access to methods such as getState(), dispatch(), and subscribe(), but reading state through store.getState() does not automatically subscribe the component for re-rendering. Therefore, for normal state access in React components, useSelector() is preferred.

Interview trap: useStore() does not mean “get all Redux state.” It means get the store object. To get the current state from it, you must call store.getState().

## useDispatch() – Event Handling in React Redux

useDispatch() is a React Redux hook used to dispatch actions to the Redux store, commonly in response to events such as button clicks, form submissions, or other user interactions.

Basic syntax
```javascript
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

dispatch(action);
```
For example:
```javascript
function Counter() {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch({ type: "counter/increment" });
  };

  return (
    <button onClick={handleIncrement}>
      Increment
    </button>
  );
}
```
Here, onClick is the React event and dispatch() sends the action to Redux.

**With Redux Toolkit**
Usually, we define the action inside a slice:

```javacript
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",

  initialState: {
    count: 0
  },

  reducers: {
    increment: (state) => {
      state.count++;
    },

    decrement: (state) => {
      state.count--;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
```
Then dispatch the actions from the component:
```javascript
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./counterSlice";

function Counter() {
  const count = useSelector(
    (state) => state.counter.count
  );

  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={handleIncrement}>
        Increment
      </button>

      <button onClick={handleDecrement}>
        Decrement
      </button>
    </div>
  );
}
```
Event-handling flow
```
User clicks button
       ↓
onClick event
       ↓
handleIncrement()
       ↓
dispatch(increment())
       ↓
Redux Reducer
       ↓
Redux Store updated
       ↓
useSelector() gets updated value
       ↓
Component re-renders
```
**useSelector() vs useDispatch()**

| Hook | Purpose | Example |
|---|---|---|
| `useSelector()` | Read data from Redux | `useSelector(state => state.counter.count)` |
| `useDispatch()` | Send actions to Redux | `dispatch(increment())` |

A simple way to remember:

```
useSelector  → GET data
useDispatch  → CHANGE data
```
**Interview answer**

useDispatch() is a React Redux hook that returns the Redux store's dispatch function. We use it to dispatch actions, often from event handlers such as onClick, onChange, or onSubmit. The dispatched action is processed by the reducer, which updates the Redux state. Components using useSelector() can then re-render when their selected state changes.

**Interview tip:** useDispatch() itself does not update the state. It only dispatches an action. The reducer determines how the state should change.



