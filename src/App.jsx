import React from 'react';
import Header from './components/Header'; // Import the header

function App() {
    return (
        <div>
            <Header /> 
            <div className="container text-center mt-4">
                <h1 className="text-primary">A Tadeo le gusta el chile</h1>
                <p>This is the main content area.</p>
            </div>
        </div>
    );
}

export default App;
