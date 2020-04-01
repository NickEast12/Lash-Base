const bookingForm = document.querySelector('.body__booking__popup');
const activationButton = document.querySelector('.booking__button');
const closeMenu = document.querySelector('.booking__cancel__menu');
const shade = document.querySelector('.app__blackout');
const page = document.querySelector('.app__wrapper');

function booking() {
    if (!bookingForm) {
        return;
    } else {
        activationButton.addEventListener('click', () => {
            shade.style.display = 'block';
            page.style.overflow = 'hidden';
            bookingForm.classList.toggle('slide-in-bottom');
            bookingForm.style.display = 'block';
        });
        closeMenu.addEventListener('click', () => {
            shade.style.display = 'none';
            page.style.overflow = 'auto';
            bookingForm.classList.toggle('slide-in-bottom');
            bookingForm.style.display = 'none';
        });

    }
}

export default booking;