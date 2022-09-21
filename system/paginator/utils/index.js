exports.default_labels = {
    en: {
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous'
    }
}
exports.convertNumber = (numbers, from_number) => {
    let from_numbers = `${from_number}`.split("");
    let final_value = '';
    for (let partial of from_numbers) {
        final_value += numbers[partial]
    }
    return final_value;
}