//CreateEvent.jsx
import Header from '../components/HeaderAndFooter/Header';
import AddRecurringEvent from '../components/AddEvent';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';

const CreateEvent = () => {
    return (
        <div>
            <Header />
            <AddRecurringEvent />
            <Schedule />
            <Footer />
        </div>
    )
}

export default CreateEvent;