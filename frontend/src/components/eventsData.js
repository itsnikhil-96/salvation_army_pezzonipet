// eventsData.js
import pic1 from '../../photos/youthmeeting/youthmeeting1.png';
import pic2 from '../../photos/sundayschool/sundayschool1.jpg';
import pic3 from '../../photos/sundayworship/sundayworship1.jpg';
import pic4 from '../../photos/homeleague/homeleaguemeeting1.jpg';
import pic5 from '../../photos/fastingprayer/fastingprayer1.jpg';
import gallery1 from '../../photos/fastingprayer/fastingprayer1.jpg';
import gallery2 from '../../photos/homeleague/homeleaguemeeting1.jpg';
import gallery3 from '../../photos/sundayworship/sundayworship1.jpg';
const events = [
    {
        eventname: "YP Annual",
        mainimage: pic1,
        date: "1-1-2024",
        images: [gallery2, gallery1, gallery3]
    },
    {
        eventname: "VBS",
        mainimage: pic2,
        date: "1-2-2024",
        images: [gallery1, gallery3, gallery2]
    },
    {
        eventname: "Christmas",
        mainimage: pic3,
        date: "1-3-2024",
        images: [gallery1, gallery2, gallery3]
    },
    {
        eventname: "New Year",
        mainimage: pic4,
        date: "1-4-2024",
        images: [gallery3, gallery2, gallery1]
    },
    {
        eventname: "Easter",
        mainimage: pic5,
        date: "1-5-2024",
        images: [gallery2, gallery1, gallery3]
    }
];

export default events;
