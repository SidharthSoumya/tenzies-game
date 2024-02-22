export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "#fff"
    }

    return (
        <button className="die" style={styles} onClick={props.toggleHold}>
            <h2 className="die-num">{props.value}</h2>
        </button>
    )
}