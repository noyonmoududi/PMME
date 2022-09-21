const {default_labels,convertNumber} = require('./utils');

module.exports = class paginator {
    /**
     * 
     * @param {int} totalCount example: 100
     * @param {int} currentPage example 1
     * @param {string} pageUri example /pages
     * @param {int} perPage example 25
     * @param {object} queries example {key:value}
     */
    constructor(totalCount, currentPage, pageUri, perPage = 25, queries = {}) {
        this.perPage = perPage;
        this.totalCount = parseInt(totalCount);
        this.currentPage = parseInt(currentPage);
        this.previousPage = this.currentPage - 1;
        this.nextPage = this.currentPage + 1;
        this.pageCount = Math.ceil(this.totalCount / this.perPage);
        pageUri = pageUri + '?';
        let iteration = 1;
        for (let q in queries) {

            if (q != 'page') {
                if (iteration == 1) {
                    pageUri += q + '=' + queries[q];
                } else {
                    pageUri += '&' + q + '=' + queries[q];
                }
                iteration++;
            }


        }
        if (iteration > 1) {
            pageUri = pageUri + '&page=';
        } else {
            pageUri = pageUri + 'page=';
        }

        this.pageUri = pageUri;

        this.offset = this.currentPage > 1 ? this.previousPage * this.perPage : 0;
        this.sidePages = 4;
        this.pages = false;


        this.lang = 'en';
        this.allowed_lang = ['en'];
        this.labels = {
            en: {
                numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                first: 'First',
                last: 'Last',
                next: 'Next',
                previous: 'Previous'
            }
        }
    }

    /**
     * 
     * @param {string} lang 'en'
     */
    setLanguage(lang = 'en') {
        if (!this.allowed_lang.includes(lang)) throw 'Language not supported.Please set allowed language first.'
        this.lang = lang;
    }

    /**
     * 
     * @param {formatted_object } labels {
        en : {
            numbers : [0,1,2,3,4,5,6,7,8,9],
            first:'First',
            last: 'Last',
            next:'Next',
            previous: 'Previous'
        }
       }
     */
    setLabels(labels) {
        this.labels = labels;
    }

    /**
     * 
     * @param {string} allowed_lang ['en','bn']
     */
    setAllowedLanguage(allowed_lang = ['en']) {
        this.allowed_lang = allowed_lang;
    }

    /**
     * 
     * @returns html
     */
    render() {
        if (this.totalCount <= this.perPage) {
            return '';
        }
        let labels = this.labels[this.lang] || default_labels['en'];
        this.pages = '<ul class="pagination pagination-md">';

        if (this.previousPage > 0) {
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + 1 + '">' + labels.first + '</a></li>';
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + this.previousPage + '">' + labels.previous + '</a></li>';
        } else {
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + 1 + '">' + labels.first + '</a></li>';
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + this.previousPage + '">' + labels.previous + '</a></li>';
        }

        let numbers = labels.numbers;
        /*Add back links*/
        if (this.currentPage > 1) {
            for (var x = this.currentPage - this.sidePages; x < this.currentPage; x++) {
                if (x > 0)
                    this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + x + '">' + convertNumber(numbers, x) + '</a></li>';
            }
        }

        /*Show current page*/
        this.pages += '<li class="page-item active"><a class="page-link" href="' + this.pageUri + this.currentPage + '">' + convertNumber(numbers, this.currentPage) + '</a></li>';

        /*Add more links*/
        for (x = this.nextPage; x <= this.pageCount; x++) {

            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + x + '">' + convertNumber(numbers, x) + ' </a></li>';

            if (x >= this.currentPage + this.sidePages)
                break;
        }


        /*Display next buttton navigation*/
        if (this.currentPage + 1 <= this.pageCount) {
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + this.nextPage + '">' + labels.next + '</a></li>';
            this.pages += '<li class="page-item"><a class="page-link" href="' + this.pageUri + this.pageCount + '">' + labels.last + '</a></li>';
        } else {
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + this.nextPage + '">' + labels.next + '</a></li>';
            this.pages += '<li class="page-item disabled"><a class="page-link" href="' + this.pageUri + this.pageCount + '">' + labels.last + '</a></li>';
        }


        this.pages += '</ul>';

        return this.pages;
    }
}