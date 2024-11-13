export default function ApplicationLogo(props) {
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI-egqbSTAaW68slKAihIJoG-Mv2oGQK3AzA&s'; // Reemplaza con tu URL

    return (
        <div>
            <center><img src={imageUrl} style={{ width: '40%', height: 'auto' }} /></center>
        </div>
    );
}
