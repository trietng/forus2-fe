import './style.css';

export function BlinkingDots() {
    return (
        <span className="blinking-dots">
            <span className="blinking-dots__dot">.</span>
            <span className="blinking-dots__dot">.</span>
            <span className="blinking-dots__dot">.</span>
        </span>
    );
}