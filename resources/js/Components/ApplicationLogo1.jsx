export default function ApplicationLogo(props) {
    const imageUrl = '/img/profesor.png';

    return (
        <div className='flex justify-end'>
            <img src={imageUrl} style={{ width: '   90%', height: 'auto' }} />
        </div>
    );
}
