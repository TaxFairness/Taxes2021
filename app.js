function hashchanged() {
    var hash = location.hash.replace(/^#/, '')

    console.log(`hashChange: ${location.hash}`)
}

window.addEventListener('hashchange', hashchanged, false)

d3.csv('TaxIncrease.csv').then(function (data) {
    // console.log(data);

    var taxData = data

    // var button = d3.select('#button')

    var form = d3.select('#form')

    // button.on('click', runEnter)
    form.on('submit', runEnter)
    form.on('input', runEnter)

    function runEnter() {
        d3.select('tbody').html('')
        // d3.selectAll('p').classed('noresults', true).html('')
        d3.event.preventDefault()
        var inputElement = d3.select('#user-input')
        var inputValue = inputElement.property('value').toLowerCase().trim()

        let el = document.getElementById('user-input')
        let rect = el.getBoundingClientRect()
        let pos = rect.top + window.scrollY
        // console.log(
        //     `Position: ${pos}, rect: ${rect.top} scrollY: ${window.scrollY}`
        // )

        window.scroll({ top: 5000, left: 0, behavior: 'smooth' })

        // el.scrollIntoView(true)

        // el.scrollIntoView({
        //     block: 'start',
        //     inline: 'nearest',
        //     behavior: 'auto',
        // })

        // console.log(`Position: ${pos}`)
        // console.log(taxData);

        let errMsg = ''
        d3.select('#errmsg').classed('noresults2', true).html(errMsg)

        if (inputValue.length < 1) {
            // errMsg =
            //     '<i><center><strong>Please enter more characters for the street name</strong></i>'
            // inputValue = 'Something to give no results'
            // d3.select('#errmsg').classed('noresults2', true).html(errMsg)
            return
        }

        var filteredData = taxData.filter((taxData) =>
            taxData.street_address.toLowerCase().trim().includes(inputValue)
        )
        // console.log(filteredData.length)
        errMsg = ''
        if (
            filteredData.length === 0
            // &&
            // inputValue !== 'Something to give no results'
        ) {
            errMsg =
                '<i><center><strong>No addressess match. Please check your spelling...</strong></center></i>'
        }
        d3.select('#errmsg').classed('noresults2', true).html(errMsg)

        output = filteredData.sort(StreetSort)

        for (var i = 0; i < filteredData.length; i++) {
            // console.log(output[i]['original_title'])
            // console.log(output[i]['avg_vote'])
            // d3.select("tbody>tr>td").text(output[i]['original_title']);
            d3.select('tbody')
                .insert('tr')
                .html(
                    `<td>${output[i]['street_address']}</td><td>${output[i]['tax_2021']}</td><td>${output[i]['delta']}</td><td>${output[i]['tax_increase']}</td><td></td><td> </td>`
                )
        }
    }
    window.resizeTo(screen.width, screen.height)
})

// Sort street addresses - by street name, then by optional street number
function StreetSort(a, b) {
    function parseStreetAddress(adrs) {
        let numRE = /^(\d*)/gi // match leading digits
        let theAdrs = adrs.street_address
        // console.log("theAdrs: %s",theAdrs, JSON.stringify(adrs))
        let aObj = numRE.exec(theAdrs) // locate leading digits
        let num = ''
        let street = ''
        if (aObj == null) street = theAdrs
        else {
            num = aObj[1]
            street = theAdrs.substr(num.length).trim().toLowerCase()
        }
        return { num, street }
    }

    let aStreet = parseStreetAddress(a)
    let bStreet = parseStreetAddress(b)

    // both num and street properties are still strings

    if (aStreet.street < bStreet.street) return -1
    if (aStreet.street > bStreet.street) return 1

    // compare length of strings - shorter numeric strings are always less
    if (aStreet.num.length < bStreet.num.length) return -1
    if (aStreet.num.length > bStreet.num.length) return 1

    if (aStreet.num == bStreet.num) return 0

    return parseInt(aStreet.num) - parseInt(bStreet.num)
}
