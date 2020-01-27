let retail_checkbox  = document.getElementById('retail');
let service_checkbox = document.getElementById('service');
let trust_button     = $('.calculator__count-item__checkbox').find('span');
let calc_price_count = $('.calculator__price-count');

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
    if (this.checked == true) { $('#term').addClass('required') } 
    if (this.checked == false && service_checkbox.checked == false) { $('#term').removeClass('required') }
}

service_checkbox.onclick = function() {
    if (this.checked == true) { $('#term').addClass('required') } 
    if (this.checked == false && retail_checkbox.checked == false) { $('#term').removeClass('required') }
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

    // Вызываем функцию обрабатывающую тариф
    $('.calculator__tarrifs-range').change(function() {
        if (this.value == 3) { first_tariff()  }
        if (this.value == 2) { second_tariff() }
        if (this.value == 1) { third_tariff()  }
        if (this.value == 0) { fourth_tariff() }
    })

    $('.calculator__tarrifs-item').click(function() {
        if (this.innerText == 'КОМЛЕКСНЫЙ')        { $('.calculator__tarrifs-range').val(3); first_tariff();          }
        if (this.innerText == 'ИП БЕЗ РАБОТНИКОВ') { $('.calculator__tarrifs-range').val(2); second_tariff();         }
        if (this.innerText == 'ОТЧЕТНОСТЬ')        { $('.calculator__tarrifs-range').val(1); third_tariff();          }
        if (this.innerText == 'ЗАРПЛАТА И КАДРЫ')  { $('.calculator__tarrifs-range').val(0); fourth_tariff();         }
    })

    let transactions_suppliers = $('.calculator__count-item').find('input[name=client]');
    let transactions_buyers = $('.calculator__count-item').find('input[name=provider]');

    // Комплексный тариф
    function first_tariff() {
        handler();
        get_span(tariff_span, 3);
        $('.calculator__activity').fadeIn(0);
        $('.calculator__count').fadeIn(0);
        sum_transactions = parseInt(transactions_suppliers.val()) + parseInt(transactions_buyers.val())
        get_sum(sum_fields(), 'ОСНО', 'ООО');

        inputs_handler('ОСНО');
        trust_we_handler('ОСНО', 'Комплексный и ИП без работников', 'ООО');

        function inputs_handler(service_type) {
            // Сделок с поставщиками
            $('#transactions_suppliers').keyup(function(){
                fields_checker(this)
                sum_transactions = parseInt(this.value) + parseInt(transactions_suppliers.val())
                get_sum(sum_fields(), service_type, 'ООО');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ООО');
            })     

            // Сделок с клиентами
            $('#transactions_buyers').keyup(function(){
                fields_checker(this)
                sum_transactions = parseInt(this.value) + parseInt(transactions_buyers.val())
                get_sum(sum_fields(), service_type, 'ООО');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ООО');
            })     

            // Штатных сотрудников
            $('#employee_input').keyup(function(){
                fields_checker(this)
                sum_transactions = parseInt(transactions_suppliers.val()) + parseInt(transactions_buyers.val())
                get_sum(sum_fields(), service_type, 'ООО');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ООО');
            })     
        }

        // Переключатель "Доверяю вам" первый тариф  
        change_trusts('ОСНО');
        function change_trusts(what) {
            $('#trust_salaryAndStaff').click(function() { 
                get_sum(sum_fields(), what, 'ООО');
            });
            $('#dealsSuppliers_trust_span').click(function() {
                get_sum(sum_fields(), what, 'ООО');
            });
            $('#dealsClients_trust_span').click(function() {
                get_sum(sum_fields(), what, 'ООО');
            });
        }
        // Переключатель "Доверяю вам" Второй тариф

        // Обработчик для спанов при переключении Input Range
        $('.calculator__taxation-step-item').click(function() {
            change_main_spans(this);
        })
        $('.calculator__taxation-range').change(function() {
            change_main_spans(this);
        })   

        function change_main_spans(el) {
            for (let g = 0; g < $('.calculator__taxation-step-item').length; g++) {
                if ($('.calculator__taxation-step-item')[g].getAttribute('data-step') == el.value) {
                    $($('.calculator__taxation-step-item')[g]).addClass('calculator__taxation-step-item_active');
                    get_sum(sum_fields(), $('.calculator__taxation-step-item')[g].innerText, 'ООО')
                    inputs_handler($('.calculator__taxation-step-item')[g].innerText);
                    change_trusts($('.calculator__taxation-step-item')[g].innerText);
                    trust_we_handler($('.calculator__taxation-step-item')[g].innerText, 'Комплексный и ИП без работников', 'ООО');
                } 
                else {
                    $($('.calculator__taxation-step-item')[g]).removeClass('calculator__taxation-step-item_active')
                }  
                if ($(el).hasClass('calculator__taxation-step-item')) {
                    $(el).addClass('calculator__taxation-step-item_active')
                    $('.calculator__taxation-range')[0].value = $(el).attr('data-step');
                    change_trusts(el.innerText);
                    get_sum(sum_fields(), el.innerText, 'ООО');
                    inputs_handler(el.innerText);
                    trust_we_handler(el.innerText, 'Комплексный и ИП без работников', 'ООО');
                }
            }
        }
        // Обработчик для спанов при переключении Input Range  
    }
    first_tariff();

    // Тариф ИП БЕЗ РАБОТНИКОВ
    function second_tariff() {
        handler();
        get_span(tariff_span, 2);
        trust_we_handler('ОСНО', 'Комплексный и ИП без работников', 'ИП без работников');
        get_sum(sum_fields(), 'ОСНО', 'ИП без работников');       
        inputs_handlers('ОСНО');
        
        $('.calculator__activity').fadeIn(0); $('.calculator__count').fadeIn(0);

        function inputs_handlers(service_type) {
            // Сделок с поставщиками
            $('#transactions_suppliers').keyup(function() {
                fields_checker(this)
                get_sum(sum_fields(), service_type, 'ИП без работников');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ИП без работников');
            })     

            // Сделок с клиентами
            $('#transactions_buyers').keyup(function() {
                fields_checker(this)
                get_sum(sum_fields(), service_type, 'ИП без работников');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ИП без работников');
            })     

            // Штатных сотрудников
            $('#employee_input').keyup(function() {
                fields_checker(this)
                get_sum(sum_fields(), service_type, 'ИП без работников');
                trust_we_handler(service_type, 'Комплексный и ИП без работников', 'ИП без работников', );
            })     
        }

        // Переключатель "Доверяю вам" Второй тариф  
        change_trusts('ОСНО');
        function change_trusts(what) {
            $('#trust_salaryAndStaff').click(function() {
                get_sum(sum_fields(), what, 'ИП без работников');
            });

            $('#dealsSuppliers_trust_span').click(function() {
                get_sum(sum_fields(), what, 'ИП без работников');
            });

            $('#dealsClients_trust_span').click(function() {
                get_sum(sum_fields(), what, 'ИП без работников');
            });
        }
        // Переключатель "Доверяю вам" Второй тариф

        // Обработчик для спанов при переключении Input Range
        $('.calculator__taxation-step-item').click(function() {
            change_main_spans(this);
        })
        $('.calculator__taxation-range').change(function() {
            change_main_spans(this);
        })   
        function change_main_spans(el) {
            for (let g = 0; g < $('.calculator__taxation-step-item').length; g++) {
                if ($('.calculator__taxation-step-item')[g].getAttribute('data-step') == el.value) {
                    $($('.calculator__taxation-step-item')[g]).addClass('calculator__taxation-step-item_active');
                    get_sum(sum_fields(), $('.calculator__taxation-step-item')[g].innerText, 'ИП без работников')
                    inputs_handlers($('.calculator__taxation-step-item')[g].innerText);
                    change_trusts($('.calculator__taxation-step-item')[g].innerText);
                    trust_we_handler($('.calculator__taxation-step-item')[g].innerText, 'Комплексный и ИП без работников', 'ИП без работников');
                } 
                else {
                    $($('.calculator__taxation-step-item')[g]).removeClass('calculator__taxation-step-item_active')
                }  
                if ($(el).hasClass('calculator__taxation-step-item')) {
                    $(el).addClass('calculator__taxation-step-item_active')
                    $('.calculator__taxation-range')[0].value = $(el).attr('data-step');
                    change_trusts(el.innerText);
                    get_sum(sum_fields(), el.innerText, 'ИП без работников');
                    inputs_handlers(el.innerText);
                    trust_we_handler(el.innerText, 'Комплексный и ИП без работников', 'ИП без работников');
                }
            }
        }
        // Обработчик для спанов при переключении Input Range  
    }

    // Отчетность
    function third_tariff() {
        
        handler();
        get_span(tariff_span, 1);

        $('.calculator__activity').fadeOut(0); $('.calculator__count').fadeOut(0);
        calc_price_count.text(excelTable_report[0]['ОСНО'].toLocaleString());

        $('.calculator__taxation-range').change(function() {
            for (let i = 0; i < $('.calculator__taxation-step-item').length; i++) {
               if ($('.calculator__taxation-step-item')[i].getAttribute('data-step') == this.value) {
                   $($('.calculator__taxation-step-item')[i]).addClass('calculator__taxation-step-item_active');
               } else {
                   $($('.calculator__taxation-step-item')[i]).removeClass('calculator__taxation-step-item_active');
               }
            }
            change_val(this.value);
        });

        $('.calculator__taxation-step-item').click(function() {
            for (let i = 0; i < $('.calculator__taxation-step-item').length; i++) {
               if ($('.calculator__taxation-step-item')[i] != this) {
                   $($('.calculator__taxation-step-item')[i]).removeClass('calculator__taxation-step-item_active');
               }
            }
            $('.calculator__taxation-range').val($(this)[0].getAttribute('data-step'));
            $(this).addClass('calculator__taxation-step-item_active');
            change_val(this.getAttribute('data-step'));
        });

        function change_val(el) {
            if (el == 0) { calc_price_count.text(excelTable_report[0]['ОСНО'].toLocaleString())    }
            if (el == 1) { calc_price_count.text(excelTable_report[0]['УСН 15%'].toLocaleString()) }
            if (el == 2) { calc_price_count.text(excelTable_report[0]['УСН 6%'].toLocaleString())  }
            if (el == 3) { calc_price_count.text(excelTable_report[0]['Патент'].toLocaleString())  }
            if (el == 4) { calc_price_count.text(excelTable_report[0]['ЕНВД'].toLocaleString())    }
        }
    }

    // Зарплата и кадры
    function fourth_tariff() {

        horisontal_spans[0].innerHTML = salaryAndStaff_inner
        get_span(tariff_span, 0);
        change_trust('Зарплата');

        $('.calculator__taxation-range').replaceWith(salaryAndStaff_horisontal_input);

        $('.calculator__taxation-range').change(function() {
            st(this.value);
            addClassSpans_lastTariff();
        }) 
        $('.calculator__taxation-step-item').click(function() {
            st(this.getAttribute('data-step'));

            $('.calculator__taxation-range').val(this.getAttribute('data-step'));
            addClassSpans_lastTariff();
        }) 

            function st(el) {
                if (el == 0) {
                    change_employee('Зарплата'); start_change('Зарплата'); 
                    change_trust('Зарплата');

                    if ($('#trust_salaryAndStaff').hasClass('checked') == false) {
                        calc_price_count.text(excelTable_salary[1]['Зарплата'].toLocaleString());
                    }
                }

                if (el == 1) { 
                    change_employee('Зарплата и кадры'); start_change('Зарплата и кадры'); 
                    change_trust('Зарплата и кадры');

                    if ($('#trust_salaryAndStaff').hasClass('checked') == false) {
                        calc_price_count.text(excelTable_salary[1]['Зарплата и кадры'].toLocaleString());
                    }
                }
            }            

        function change_trust(what) {
            $('#trust_salaryAndStaff').click(function() {
                if ($('#trust_salaryAndStaff').hasClass('checked') == false) { 
                    calc_price_count.text(excelTable_salary[1][what].toLocaleString());
                }
                else {
                    calc_price_count.text(count($('#employee_input').val(), excelTable_salary, what).toLocaleString());
                }
            });
        }

        function change_employee(service_type) {
            emloyee_counter.keyup(function() {
                if (this.value > 100) { this.value = 99 }
                if ($('#trust_salaryAndStaff').hasClass('checked') == false) { 
                    calc_price_count.text(excelTable_salary[1][service_type].toLocaleString());
                    return false; 
                }
                else {
                    calc_price_count.text(count(this.value, excelTable_salary, service_type).toLocaleString());
                }
            });
        }

        function start_change(service_type) {
            calc_price_count.text(count(emloyee_counter.val(), excelTable_salary, service_type).toLocaleString());
        }

        change_employee('Зарплата');
        start_change('Зарплата');

        $('.calculator__activity').fadeOut(0);
        $('.calculator__count').fadeIn(0);
        $('#business_partners').fadeOut(0);
        $('#deals').fadeOut(0);
        $('#staff_span').addClass('item-active')

        if ($('#trust_salaryAndStaff').hasClass('checked') == false) {
            calc_price_count.text(excelTable_salary[1]['Зарплата'].toLocaleString());
        }
    }

    function count(staff_count, table, row, trust_we = 'true') {
        let salary_sum = 0; 

        if (staff_count < 6) { salary_sum = table[1][row]; return salary_sum; }

        let start_summ = 0
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
        $('#business_partners').fadeIn(0);
        $('#deals').fadeIn(0);
        $('#staff_span').removeClass('item-active')
    }
    // Обработчик Checkbox Range

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
    // Получаем спаны связанные с чекбоксами и присваем им класс при изменении ранга

    // Обработчик для чекбокса "Доверяю вам"
    function trust_we_handler(row, service_type, tariff_type) {
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
    // Обработчик для чекбокса "Доверяю вам"
}
// Вешаем обрабочики на тарифы

// Подсчет суммы для тарифов "Комплексный" и "ИП Без работников"
function get_sum(transactions, service_type, tariff_type) {
    transactions = parseFloat(transactions);

    if (tariff_type == 'ООО') { 
        service_type == 'ПАТЕНТ' ? service_type = 'Патент' : service_type = service_type
        for (let i = 0; i < excelTable_main.length; i++) {
            let from = excelTable_main[i]['__EMPTY'];
            let to = excelTable_main[i]['__EMPTY_1'];

            // Если цена больше допустимой
            let e_price = 0;
            if (transactions >= excelTable_main[excelTable_main.length - 1].__EMPTY_1) {
                if (service_type == 'ОСНО')    { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1][service_type];
                    e_price = excelTable_main[i].__EMPTY_3; }
                if (service_type == 'УСН 15%') { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1][service_type];  
                    e_price = excelTable_main[i].__EMPTY_6;  }
                if (service_type == 'УСН 6%')  { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1][service_type];
                    e_price = excelTable_main[i].__EMPTY_9;    }
                if (service_type == 'ПАТЕНТ')  { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1][service_type];
                    e_price = excelTable_main[i].__EMPTY_12;    }
                if (service_type == 'ЕНВД')    { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1][service_type];  
                    e_price = excelTable_main[i].__EMPTY_15;  }

                let get_epml_summ = 0;
                if ($('#trust_salaryAndStaff').hasClass('checked') == true) {
                    if (parseInt($('#employee_input').val()) <= 1) { 
                        get_epml_summ = 0 
                    } else { 
                        get_epml_summ = parseInt($('#employee_input').val()) * e_price 
                    }
                } else { get_epml_summ = 0 }

                calc_price_count.text(emloyee_price + get_epml_summ);   

            } else {
                if (transactions <= parseInt(to) && transactions >= parseInt(from)) {
                    let price = excelTable_main[i][service_type]; // Стандартная цена
                    let emloyee_price = 0;

                    // Подбираем цену для сделок в зависимости от тарифа
                    if (service_type == 'ОСНО')    { 
                        emloyee_price = excelTable_main[i].__EMPTY_3; }
                    if (service_type == 'УСН 15%') { 
                        emloyee_price = excelTable_main[i].__EMPTY_6;  }
                    if (service_type == 'УСН 6%')  { 
                        emloyee_price = excelTable_main[i].__EMPTY_9;  }
                    if (service_type == 'ПАТЕНТ')  { 
                        emloyee_price = excelTable_main[i].__EMPTY_12; }
                    if (service_type == 'ЕНВД')    { 
                        emloyee_price = excelTable_main[i].__EMPTY_15; }
                                
                    let get_epml_summ = 0;

                    if ($('#trust_salaryAndStaff').hasClass('checked') == true) {
                        if (parseInt($('#employee_input').val()) <= 1) { 
                            get_epml_summ = 0 
                        } else { 
                            get_epml_summ = parseInt($('#employee_input').val()) * emloyee_price - emloyee_price 
                        }
                    } else {
                        get_epml_summ = 0
                    }

                    let final = price + get_epml_summ;
                    calc_price_count.text(final);
                }
            }
        }
    }

    if (tariff_type == 'ИП без работников') {
        for (let i = 0; i < excelTable_main.length; i++) {
            let from = excelTable_main[i]['__EMPTY'];
            let to = excelTable_main[i]['__EMPTY_1'];

            let e_price = 0;
            // Если цена больше допустимой
            if (transactions >= excelTable_main[excelTable_main.length - 1].__EMPTY_1) {
                if (service_type == 'ОСНО')    { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1].__EMPTY_2;  
                    e_price = excelTable_main[i].__EMPTY_4 }
                if (service_type == 'УСН 15%') { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1].__EMPTY_5;  
                    e_price = excelTable_main[i].__EMPTY_7 }
                if (service_type == 'УСН 6%')  { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1].__EMPTY_8;  
                    e_price = excelTable_main[i].__EMPTY_10 }
                if (service_type == 'ПАТЕНТ')  { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1].__EMPTY_11;  
                    e_price = excelTable_main[i].__EMPTY_13 }
                if (service_type == 'ЕНВД')    { 
                    emloyee_price = excelTable_main[excelTable_main.length - 1].__EMPTY_14;  
                    e_price = excelTable_main[i].__EMPTY_16 }

                let get_epml_summ = 0;
                if ($('#trust_salaryAndStaff').hasClass('checked') == true) {
                    if (parseInt($('#employee_input').val()) <= 1) { 
                        get_epml_summ = 0 
                    } else { 
                        get_epml_summ = parseInt($('#employee_input').val()) * e_price 
                    }
                } else { get_epml_summ = 0 }

                calc_price_count.text(emloyee_price + get_epml_summ);   

            } else {
                if (transactions <= parseInt(to) && transactions >= parseInt(from)) {
                    let price = 0;
                    let emloyee_price = 0;

                    if (service_type == 'ОСНО') { 
                        price = excelTable_main[i].__EMPTY_2;  
                        emloyee_price = excelTable_main[i].__EMPTY_4;
                    }
                    if (service_type == 'УСН 15%') { 
                        price = excelTable_main[i].__EMPTY_5;  
                        emloyee_price = excelTable_main[i].__EMPTY_7;
                    }
                    if (service_type == 'УСН 6%') { 
                        price = excelTable_main[i].__EMPTY_8; 
                        emloyee_price = excelTable_main[i].__EMPTY_10;
                    }
                    if (service_type == 'ПАТЕНТ') { 
                        price = excelTable_main[i].__EMPTY_11; 
                        emloyee_price = excelTable_main[i].__EMPTY_13;
                    }
                    if (service_type == 'ЕНВД') { 
                        price = excelTable_main[i].__EMPTY_14; 
                        emloyee_price = excelTable_main[i].__EMPTY_16;
                    }
                    
                    let get_epml_summ = 0;

                    if ($('#trust_salaryAndStaff').hasClass('checked') == true) {
                        if (parseInt($('#employee_input').val()) <= 1) { get_epml_summ = 0 }
                        else { get_epml_summ = parseInt($('#employee_input').val()) * emloyee_price - emloyee_price }
                    }   else { get_epml_summ = 0 }

                    calc_price_count.text(price + get_epml_summ);
                } 
            }
        }
    }
    final_price_handler();
}
// Подсчет суммы для тарифов "Комплексный" и "ИП Без работников"

// Подсчет суммы ! полей ! для тарифов "Комплексный" и "ИП Без работников"
function sum_fields() {
    let sum = 0
    $('#dealsClients_trust_span').hasClass('checked')          == false  
        ?  sum = $('#transactions_suppliers').val()            : sum = sum;

    $('#dealsSuppliers_trust_span').hasClass('checked')        == false  
        ?  sum = $('#transactions_buyers').val()               : sum = sum;

    $('#dealsSuppliers_trust_span').hasClass('checked')        == false  
        && $('#dealsClients_trust_span').hasClass('checked')   == false 
        ? sum = 0                                              : sum = sum;

    $('#dealsClients_trust_span').hasClass('checked')          == true   
        && $('#dealsSuppliers_trust_span').hasClass('checked') == true 
        ? sum = parseInt($('#transactions_suppliers').val())   + 
        parseInt($('#transactions_buyers').val())              : sum = sum;
    
    return sum;
}
// Подсчет суммы ! полей ! для тарифов "Комплексный" и "ИП Без работников"

function addClassSpans_lastTariff() {
    for (let index = 0; index < $('.calculator__taxation-step-item').length; index++) {
        if ( $($('.calculator__taxation-step-item')[index]).hasClass('calculator__taxation-step-item_active')) {
            $($('.calculator__taxation-step-item')[index]).removeClass('calculator__taxation-step-item_active');
        } else {
            $($('.calculator__taxation-step-item')[index]).addClass('calculator__taxation-step-item_active');
        }
    }
}

function fields_checker(el) {
    if (el.value[0] == 0 && el.value.length > 1) {
        el.value = el.value.slice(1);
    }
    if (el.value == '') {
        el.value = 0;
    }
}

function final_price_handler() {
    $('.calculator__price-count').text(Math.ceil(parseFloat($('.calculator__price-count').text())).toLocaleString())
    let price = $('.calculator__price-count').text();
};

$('.calculator__activity-item').find('input').change(function() {

    let count = 0;
    for (let index = 0; index < $('.calculator__activity-item').find('input').length; index++) {
        if ($('.calculator__activity-item').find('input')[index].checked == true) {
            count ++;
        }
    }

    if (count == 0) { $('#services')[0].checked = true }
    console.log(count)
})

// Оставить заявку
$('.btn.btn_calculator').click(function() {
    let tariff = {};

    tariff.type = $('.calculator__tarrifs-item_active').text();
    tariff.price = $('.calculator__price-count').text();
    tariff.suppliers = {'count' : $('#transactions_suppliers').val()};
    tariff.buyers = {'count' : $('#transactions_buyers').val()};
    tariff.employers = {'count' : $('#employee_input').val()};
    tariff.select_services = '';

    $('#dealsSuppliers_trust_span').hasClass('checked') == true ? tariff.suppliers.trust_we = 'Доверяет ведение нам' : tariff.suppliers.trust_we = 'Не доверяет ведение нам'
    $('#dealsClients_trust_span').hasClass('checked') == true ? tariff.buyers.trust_we = 'Доверяет ведение нам' : tariff.buyers.trust_we = 'Не доверяет ведение нам'
    $('#trust_salaryAndStaff').hasClass('checked') == true ? tariff.employers.trust_we = 'Доверяет ведение нам' : tariff.employers.trust_we = 'Не доверяет ведение нам'

    // Выбранные виды деятельности
    for (let index = 0; index < $('.calculator__activity-list').find('input').length; index++) {
        if ($('.calculator__activity-list').find('input')[index].checked == true) {
            tariff.select_services += $('.calculator__activity-list').find('input')[index].id + ', '
        }
    }
    // Выбранная услуга
    for (let index = 0; index < $('.calculator__taxation-step-item').length; index++) {
        if ($($('.calculator__taxation-step-item')[index]).hasClass('calculator__taxation-step-item_active')== true) {
            tariff.service = $('.calculator__taxation-step-item')[index].innerText
        }
    }
    
    if (tariff.type == 'Отчетность') { 
        delete tariff.buyers    ; delete tariff.suppliers       ;
        delete tariff.employers ; delete tariff.select_services ;
    }
    if (tariff.type == 'Зарплата и кадры') { 
        delete tariff.buyers          ; delete tariff.suppliers ;
        delete tariff.select_services ;
    }

    console.log(tariff)
})