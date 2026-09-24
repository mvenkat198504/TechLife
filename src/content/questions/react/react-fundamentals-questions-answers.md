---
id: react-react-fundamentals-questions-answers
slug: react-fundamentals-questions-answers
title: React Fundamentals Questions & Answers
categoryId: react
subcategory: React Fundamentals
difficulty: Basic
tags:
  - React Fundamentals
  - Lazy Initialization
  - Component Life Cycle Methods
  - useEffect()
  - useRef()
summary: React Fundamentals Questions & Answers
updatedAt: 2026-09-24
status: published
thumbnail: ""
videos: []
resources: []
---

# React Fundamentals Questions & Answers

## 1.React Declrative?

With declarative,you just tell what to do and in imperative you also tell how to do, i.e. too much of instructions or in other words coding steps.
With Reatct, you create a component and tell that - how you want the DOM to be and restis handled by react

## 2. What is Jsx?
JSX is the HTML you write inside the javascript

## 3.What is props in a component?

The data passed as attribute in the componenents tag- that is passed as an Object Literal in the function

## 4.How to display probs value?
using curly braces {} to display probs value

## 5. What is Props
"props" are the values you pass as attributes with compoenent. props are immutable(you cannot changes props)

## 6. Explain Destructring of props
```javascript
const {name,age)=props
or
function personinfo({name,age})
{
}
```
## 6.What is State?
"State" is like a variable which is being watched by react application 
if there any changes made to the "State" React will make sure that they are re-rendered
The Changes are updating in th DOM as well
```
const [count,setCount]=useState(0)
```
This kind of a setter method wich allows you change the state

## 7. What is State in component?
Directly taking a variable will not refresh/render it on a page but when taken as state-then whatever changes are done to the state, those are automatically reflected on the user interface.
Sates basically contain the data which changes & it is the data which the user sees.
There might be different vaiables also which you can take but they do nto affect the user interace 
=> So, we don't take those variables as states <=

## 8.How do you create a state in afunctional component? Or Explain the purpose of useState() hook

useState() always returns one array with two elements
1.values which we have given of the state (number,boolean,string,array,object leteral)
2.A function which allows you to change the state value

## 9.Lazy Initialization

Whenever you have bigger process which is going to give you the initial state value, & that you put it in a function- then instead of writing the function only-do make sure that you follow the lazy initialization
Relative Questions
1. Explain lazy initialization with useState() hook
2. What exactly is lazy initialization?
```javascript
function initialState(){
	console.log("Expensive process:"+Date.now());
}
export default function App() {
	const [cnt,setCount]=useState(()=>initialState());
}
```

## 10.How do you write events?
![react_fundamentals1.png](/images/react/react-fundamentals/react_fundamentals1.png)

## 11.How do you pass parameters with event handling?
![react_fundamentals2.png](/images/react/react-fundamentals/react_fundamentals2.png)

## 12.How do you apply css with react/

There are many libraries available to apply css with react
Basic 2 ways

1.External Styling 
2.Inline styling

![react_fundamentals3.png](/images/react/react-fundamentals/react_fundamentals3.png)

## 13. what is JSX
Any code which appears like HTML and is written inside JavaScript is the JSX	Code

## 14.How do you display the content of JSX?

![react_fundamentals4.png](/images/react/react-fundamentals/react_fundamentals4.png)

## 14. What is advantage of using JSX?

![react_fundamentals5.png](/images/react/react-fundamentals/react_fundamentals5.png)

## 15.Write the React.createElement() method for the given JSX
```
<h1 style={{color:’red’}}>Hello</h1>
```
![react_fundamentals6.png](/images/react/react-fundamentals/react_fundamentals6.png)

## 16. What is the advantage of New JSX transform?

## 17.<h3> { mflag}</h3> what will be the output of this line ?![react_fundamentals7.png](/images/react/react-fundamentals/react_fundamentals7.png)

## 18. How will you reverse a Boolean state on click of a button?

![react_fundamentals8.png](/images/react/react-fundamentals/react_fundamentals8.png)

## 19.How will you update an object state in a function component?

![react_fundamentals9.png](/images/react/react-fundamentals/react_fundamentals9.png)


![react_fundamentals10.png](/images/react/react-fundamentals/react_fundamentals10.png)

## 20. Explain the statefull and stateless component?

In Versions before React 16.8 Class was the only component which could use "state" in it
- "Stateful Component" referred as "Class component"
- "Stateless component" referred as "Functional component"

A **stateless component** is a React component that does not manage its own state. It receives data through props and renders the UI. It is mainly used for presentation and is easy to reuse and test.

A **stateful component manages** its own data using React state (such as useState) and can update the UI in response to user interactions, API responses, or other events. It often contains business logic, event handlers, and side effects (using useEffect when needed).

In modern React, both stateful and stateless components are typically implemented as **function components.** The difference is whether the component manages state or simply renders data passed via props.

## 21. Convert this functional component into  class component

![react_fundamentals11.png](/images/react/react-fundamentals/react_fundamentals11.png)

## 22.What is a render() method in class component?

- Render() is a very essential component life cycle method
- Render() is needed when you have class so whatever and whenever states are updated , this method will alled
- Render() is containing the JSX which is the user interface

## 23.How do you declare state in a class component?

![react_fundamentals12.png](/images/react/react-fundamentals/react_fundamentals12.png)

## 24. What is  Component Life Cycle Methods in a class component?

When you have a class component there are various phases where the component life cycle methods are getting executed automatically

![react_fundamentals13.png](/images/react/react-fundamentals/react_fundamentals13.png)

## 25.Explain phases of life cycle methods
![react_fundamentals14.png](/images/react/react-fundamentals/react_fundamentals14.png)

## 26. Explain the purpose of life cycle methods

The main purpose of life cycle methods is to execute pieces of codes depending on the sequence.

When the component is mounted & want to execute something then you want place that piece of code inside the mounting phase methods

If you want to something to initialise then you generally use the **constructor()** as a life cycle method

Whatever needs to be refreshed on the user interface,we put those things inside the **render()** method.

The purpose of **life cycle methods** is that we execute pieces of codes depending on the sequence

## 27.useEffect()

1. Do you have life cycle methods in functional component/
No, we do not have life cycle methods in a functional component
We have the **useEffect()** hook which can be used to deal with few of the component life cycle methods like situation

2.How do you manage life cycle methods like functionality inside a functional component/
We use the **useEffect()** hook to manage life cycle methods like functionality inside a functional component
3. What is the purpose of useEffect() hook?
If you know life cycle methods, you can think of **useEffect()** hook as **componentDidMount()
componentDidUpdate() & componentWillUnmount()**  combined


## 28. How can you prevent useEffect() to be called for all states? Or How do you skip the useEffect() for specific states?
![react_fundamentals15.png](/images/react/react-fundamentals/react_fundamentals15.png)

##29. How can you write mount and unmount kind of phases with the functional component?	Or Explain clean up code with useEffect() hook? Or How will you configure componentWillUnmoung() inside a functional component?

The cleanup function in the useEffect() hook is used to remove or clean up side effects before the component unmounts or before the effect runs again. This helps prevent memory leaks, duplicate event listeners, and unnecessary background tasks.

The function returned from useEffect is the cleanup function.

![react_fundamentals16.png](/images/react/react-fundamentals/react_fundamentals16.png)








