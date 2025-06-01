export default function ApplicationLogo(props) {
    const imageUrl = '/img/logo.png'; // Reemplaza con tu URL

    return (
        <div>
            <center><img src={imageUrl} style={{ width: '40%', height: 'auto' }} /></center>
        </div>
    );
}
