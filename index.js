let retail_checkbox  = document.getElementById('retail');
let service_checkbox = document.getElementById('service');
let trust_button     = $('.calculator__count-item__checkbox').find('span');

let emloyee_counter  = $('.calculator__count-item__left').find('input[name=employee]')

let tariff_span      = $('.calculator__tarrifs-list').children();
let horisontal_spans = $('.calculator__taxation-step');

let salaryAndStaff_inner = '<span data-step="0" class="calculator__taxation-step-item calculator__taxation-step-item_active">Заработная плата</span>' +
                           '<span data-step="1" class="calculator__taxation-step-item">Заработная плата и кадровый учет</span>'

let default_inner        = '<span data-step="0" class="calculator__taxation-step-item calculator__taxation-step-item_active">ОСНО</span>' +
						   '<span data-step="1" class="calculator__taxation-step-item">УСН 15%</span>' +
						   '<span data-step="2" class="calculator__taxation-step-item">УСН 6%</span>' +
						   '<span data-step="3" class="calculator__taxation-step-item">ПАТЕНТ</span>' +
						   '<span data-step="4" class="calculator__taxation-step-item">ЕНВД</span>';


let defaul_horisontal_input         = '<input type="range" class="calculator__taxation-range" min="0" max="4" step="1" value="0">';
let salaryAndStaff_horisontal_input = '<input type="range" class="calculator__taxation-range" min="0" max="1" step="1" value="0">';

let data = [];

// Вешаем обрабочики на чекбоксы Розничная торговля и сервис
retail_checkbox.onclick = function() {
    console.log(this)
    if (this.checked == true) {
        $('#term').addClass('required')
    } 
    if (this.checked == false && service_checkbox.checked == false) {
        $('#term').removeClass('required') 
    }
}

service_checkbox.onclick = function() {
    console.log(retail_checkbox.checked)
    if (this.checked == true) {
        $('#term').addClass('required')
    } 
    if (this.checked == false && retail_checkbox.checked == false) {
        $('#term').removeClass('required') 
    }
}
// Вешаем обрабочики на чекбоксы Розничная торговля и сервис

// Парсим EXCEL Файл
let url = "calc.xlsx";
let oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function (e) {
    let arraybuffer = oReq.response;

    /* convert data to binary string */
    let data = new Uint8Array(arraybuffer);
    let arr = new Array();
    for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    let bstr = arr.join("");

    /* Call XLSX */
    let workbook = XLSX.read(bstr, { type: "binary" });

    /* Get worksheet */
    let worksheet_main = workbook.Sheets['Комплексный и ИП без работников'];
    let worksheet_report = workbook.Sheets['Отчетность'];
    let worksheet_salary = workbook.Sheets['зарплата и кадры'];

    //Таблица по тарифам - комплекисный и ИП без работинков
    excelTable_main = XLSX.utils.sheet_to_json(worksheet_main);
    excelTable_report = XLSX.utils.sheet_to_json(worksheet_report);
    excelTable_salary = XLSX.utils.sheet_to_json(worksheet_salary);
    
    return next();
}
oReq.send();
// Парсим Excel Файл />

// Вешаем обрабочики на тарифы
function next() {

    $('.calculator__tarrifs-range').change(function() {
        if (this.value == 3) { first_tariff()  }
        if (this.value == 2) { second_tariff() }
        if (this.value == 1) { third_tariff()  }
        if (this.value == 0) { fourth_tariff() }
    })

    function first_tariff() {
        handler();
        get_span(tariff_span, 3)
        $('.calculator__activity').fadeIn(500)
        $('.calculator__count').fadeIn(500)

        console.log(excelTable_main)
    }
    first_tariff();

    function second_tariff() {
        handler();
        get_span(tariff_span, 2)
        $('.calculator__activity').fadeIn(500)
        $('.calculator__count').fadeIn(500)

        console.log(excelTable_main)
    }

    // Отчетность
    function third_tariff() {
        handler();
        get_span(tariff_span, 1)
        $('.calculator__activity').fadeOut(500)
        $('.calculator__count').fadeOut(500);
        $('.calculator__price-count').text(excelTable_report[0]['ОСНО'])

        $('.calculator__taxation-range').change(function() {
            if (this.value == 0) {
                $('.calculator__price-count').text(excelTable_report[0]['ОСНО'])
            }
            if (this.value == 1) {
                $('.calculator__price-count').text(excelTable_report[0]['УСН 15%'])
            }
            if (this.value == 2) {
                $('.calculator__price-count').text(excelTable_report[0]['УСН 6%'])        
            }
            if (this.value == 3) {
                $('.calculator__price-count').text(excelTable_report[0]['Патент'])
            }
            if (this.value == 4) {
                $('.calculator__price-count').text(excelTable_report[0]['ЕНВД']) 
            }
        })
    }

    // Зарплата и кадры
    function fourth_tariff() {
        trust_we_handler('', 'Зарплата');

        horisontal_spans[0].innerHTML = salaryAndStaff_inner
        get_span(tariff_span, 0)

        $('.calculator__taxation-range').replaceWith(salaryAndStaff_horisontal_input);

        $('.calculator__taxation-range').change(function() {
            if (this.value == 0) {
                change_employee('Зарплата')
                trust_we_handler('', 'Зарплата');
                start_change('Зарплата')
            }

            if (this.value == 1) { 
                change_employee('Зарплата и кадры');
                trust_we_handler('', 'Зарплата и кадры')
                start_change('Зарплата и кадры');
            }
        })

        function change_employee(service_type) {
            emloyee_counter.change(function() {
                if (this.value > 100) { this.value = 99 }
                $('.calculator__price-count').text(count(this.value, excelTable_salary, service_type));
            });
        }

        function start_change(service_type) {
            $('.calculator__price-count').text(count(emloyee_counter.val(), excelTable_salary, service_type));
        }
        change_employee('Зарплата');
        start_change('Зарплата');

        $('#trust_salaryAndStaff').click(function(){
            console.log(this)
        })

        $('.calculator__activity').fadeOut(500);
        $('.calculator__count').fadeIn(500);
        $('#business_partners').fadeOut(500);
        $('#deals').fadeOut(500);
        $('#staff_span').addClass('item-active')

    }

    //console.log(excelTable_salary)
    //console.log(excelTable_report)
    function count(staff_count, table, row, trust_we = 'true') {
        let salary_sum = 0; 

        if (staff_count <= 6 || trust_we == 'false') { 
            salary_sum = table[1][row]; 
            return salary_sum; 
        }

        staff_count >= 6  && staff_count <= 15  ? salary_sum = table[2][row] * emloyee_counter.val() : salary_sum = salary_sum;
        staff_count >= 16 && staff_count <= 30  ? salary_sum = table[3][row] * emloyee_counter.val() : salary_sum = salary_sum;
        staff_count >= 31 && staff_count <= 50  ? salary_sum = table[4][row] * emloyee_counter.val() : salary_sum = salary_sum;
        staff_count >= 51 && staff_count <= 100 ? salary_sum = table[5][row] * emloyee_counter.val() : salary_sum = salary_sum;
        return salary_sum;
    }

    // Обработчик Checkbox Range
    function handler() {
        $('.calculator__taxation-range').replaceWith(defaul_horisontal_input)
        horisontal_spans[0].innerHTML = default_inner
        $('#business_partners').fadeIn(500);
        $('#deals').fadeIn(500);
        $('#staff_span').removeClass('item-active')
    }

    // Получаем спаны связанные с чекбоксами и присваем им класс при изменении ранга
    function get_span(spans, pos) {
        $('.calculator__taxation-subtitle.calculator__subtitle').text('Вид услуги')
        for (let index = 0; index < spans.length; index++) {
            if (spans[index].getAttribute('data-step') == pos) {
                spans[index].className = 'calculator__tarrifs-item calculator__tarrifs-item_active'
            } else {
                $(spans[index]).removeClass('calculator__tarrifs-item_active')
            }
        }
    }

    // Обработчик для чекбокса "Доверяю вам"
    function trust_we_handler(row = '', service_type) {
        for (let index = 0; index < trust_button.length; index++) {
            trust_button[index].onclick = function() {
                let input = $(this).parents('.calculator__count-item__checkbox').find('input');
                if ($(input).attr('checked') == 'checked') {
                    $(input).parents('.calculator__count-item__checkbox').find('span').removeClass('checked');
                    $(input).attr('checked', false);
                } else {
                    $(input).attr('checked', 'checked');
                    $(input).parents('.calculator__count-item__checkbox').find('span').addClass('checked');
                }
            }
        }
    }
}
// Вешаем обрабочики на тарифы