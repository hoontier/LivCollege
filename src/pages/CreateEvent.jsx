//CreateEvent.jsx
import Header from '../components/HeaderAndFooter/Header';
import AddEvent from '../components/Events/AddEvent';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';

const CreateEvent = () => {
    return (
        <div>
            <Header />
            <AddEvent />
            <Schedule />
            <Footer />
        </div>
    )
}

export default CreateEvent;