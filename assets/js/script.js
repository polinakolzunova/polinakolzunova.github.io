$(() => {

    let jsondata;
    let date = {
        day: 0,
        month: 0,
        year: 0,
        d1: 0,
        d2: 0,
        d3: 0,
        d4: 0,
        d5: 0,
        d6: 0
    };

    $.getJSON('assets/data/results.json', afterLoadResults);

    function afterLoadResults(data) {
        jsondata = data.data;
        for (let key in jsondata) {
            $(`.description #bl${key} p`).text(jsondata[key].v1);
        }
    }

    $("#btn-clear").click(function (e) {
        $("#txt-date").val("");
        $("#dg1").text("00");
        $("#dg2").text("00");
        $("#dg3").text("0000");
        $("#dg4").text("00");
        $("#dg5").text("00");
        $("#dg6").text("00");
        $("#dg7").text("00");
        $("#dg8").text("00");
        $("#dg9").text("00");
        $("#td0").text("0");
        $("#td1").text("1");
        $("#td2").text("2");
        $("#td3").text("3");
        $("#td4").text("4");
        $("#td5").text("5");
        $("#td6").text("6");
        $("#td7").text("7");
        $("#td8").text("8");
        $("#td9").text("9");
        $("#td10").text("10");
        $("#td11").text("11");
        $("#td12").text("12");
        $(".matrix td").removeClass('td-low');
        $(".matrix td").removeClass('td-high');
        $(".description > div").removeClass("bl-low");
        $(".description > div").removeClass("bl-high");
        $(".description .bl-status").text("Норма");
        afterLoadResults({data: jsondata});
    });

    $("#btn-match").click(function (e) {
        // установка начальных(исходных) значений
        let digits = "";
        let exdigits = "";
        let matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let exmatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let val = ($("#txt-date").val()).split('-');
        date.year = val[0];
        date.month = val[1];
        date.day = val[2];

        // вычисление дополнительных значений
        date.d1 = digitSum(date.day) + digitSum(date.month) + digitSum(date.year);
        date.d2 = digitSum(date.d1);
        date.d3 = date.d1 - Math.floor(date.day / 10) * 2;
        date.d4 = digitSum(date.d3);
        date.d5 = date.d1 + date.d3;
        date.d6 = date.d2 + date.d4;

        // отображение результатов вычислений
        $("#dg1").text(date.day);
        $("#dg2").text(date.month);
        $("#dg3").text(date.year);
        $("#dg4").text(date.d1);
        $("#dg5").text(date.d2);
        $("#dg6").text(date.d3);
        $("#dg7").text(date.d4);
        $("#dg8").text(date.d5);
        $("#dg9").text(date.d6);

        // формируем матрицы количества каждой цифры
        for (let key in date) {
            if ((date[key] == 10 || date[key] == 11 || date[key] == 12) && !(key == "day" || key == "month" || key == "year")) {
                if (key == "d5" || key == "d6") exmatrix[date[key]]++;
                else matrix[date[key]]++;
                if ( !(date[key] != 11 && date.year < 2000) ) continue;
            }

            if (key == "d5" || key == "d6") exdigits += String(date[key]);
            else digits += String(date[key]);
        }

        for (let i = 0; i < digits.length; i++) matrix[Number(digits[i])] += 1;
        for (let i = 0; i < exdigits.length; i++) exmatrix[Number(exdigits[i])] += 1;

        // очистка стилей
        $(".matrix td").text("");
        $(".matrix td").removeClass('td-low');
        $(".matrix td").removeClass('td-high');
        $(".description > div").removeClass("bl-low");
        $(".description > div").removeClass("bl-high");

        // отображение значений в матрицу и расшифровка этих значений
        for (let key in matrix) {
            if (matrix[key] > 0)
                $(`#td${key}`).text(loopString(key, matrix[key]) + " ");
            else
                $(`#td${key}`).text("- ");
            if (matrix[key] < jsondata[key].cnt) {
                $(`#td${key}`).addClass("td-low");
                $(`#bl${key}`).addClass("bl-low");
                $(`#bl${key} .bl-status`).text("Меньше");
                $(`#bl${key} p`).text(jsondata[key].v2);
            } else if (matrix[key] > jsondata[key].cnt) {
                $(`#td${key}`).addClass("td-high");
                $(`#bl${key}`).addClass("bl-high");
                $(`#bl${key} .bl-status`).text("Больше");
                $(`#bl${key} p`).text(jsondata[key].v3);
            } else {
                $(`#bl${key} .bl-status`).text("Норма");
                $(`#bl${key} p`).text(jsondata[key].v1);
            }
        }

        // отображение значений в скобках
        for (let key in exmatrix)
            if (exmatrix[key] > 0)
                $(`#td${key}`).append("(" + loopString(key, exmatrix[key]) + ")");
    });

    function loopString(digit, count) {
        let res = "";
        for (let i = 0; i < count; i++) {
            res += String(digit) + " ";
        }
        return res.slice(0, -1);
    }

    function digitSum(number) {
        let res = 0;
        while (number > 0) {
            res += number % 10;
            number = Math.floor(number / 10);
        }
        return res;
    }

});