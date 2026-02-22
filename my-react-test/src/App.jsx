// A simple component with no props
const Header = () => {
  return <h1>Our first React page</h1>
}

// A component that accepts props - the { target } syntax extracts the 'target' prop
// We can then use {target} in the JSX to inject the prop value into the HTML
const WelcomeText = ({ target }) => (
  <h2>Hello, {target}!</h2>
)

// Our main App component - this gets rendered into the DOM by main.jsx
// Notice how we can reuse WelcomeText with different prop values
export const App = () => (
  <div>
    <Header />
    <WelcomeText target="world" />
    <WelcomeText target="everyone" />
  </div>
)