export default function ApplicationLogo(props) {
    const imageUrl = '/img/logo50.png'; // Reemplaza con tu URL

    return (
        <div>
            <center><img src={imageUrl} style={{ width: '25%', height: 'auto' }} /></center>
        </div>
    );
}
