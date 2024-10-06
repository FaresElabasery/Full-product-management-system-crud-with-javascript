// get elements
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let Discount = document.getElementById('Discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let Category = document.getElementById('category');
let submit = document.getElementById('submit');

// variables helping to determine id of each element
var mood = 'create';
var temp;

// calculates the total cost of a product based on the provided price, taxes, ads, and discount.
function getTotal() {
    if (+Discount.value > 100 || +Discount.value < 0) {
        swal("Range Error", "Discount must be between 0 and 100", "error");
        Discount.value = '';
    }
    if (price.value != '') {
        if (Discount.value != '') {
            var discountPrice = (+price.value + +ads.value + +taxes.value) * (+Discount.value / 100);
            var result = +price.value + +ads.value + +taxes.value - discountPrice;
        } else {
            var result = +price.value + +ads.value + +taxes.value;
        }
        total.innerHTML = result;
        total.style.backgroundColor = 'var(--fourth-color)';
    } else {
        total.innerHTML = '';
        total.style.backgroundColor = ' var(--primary-color)';
    }
}
// validation 
function validate() {
    if (price.value < 0 || taxes.value < 0 || ads.value < 0) {
        swal("Invalid Number", `it must be a positive number`, "error");
        price.value = ''; taxes.value = ''; ads.value = ''
    }
    getTotal()
}
//Add product
// check if product already exists
var arrProduct;
if (localStorage.length > 0) {
    arrProduct = JSON.parse(localStorage.Product) // Json.parse(localStorage.getItem('Product))
} else
    arrProduct = [];

//  handles the functionality of adding a new product to the system.
submit.onclick = function () {
    if (title.value != '' && price.value != '' && taxes.value != '' && ads.value != '' && Category.value != '') {
        var objProduct = {
            title: title.value.toLowerCase(),
            price: price.value,
            taxes: taxes.value,
            count: count.value,
            ads: ads.value,
            Discount: Discount.value,
            total: total.innerHTML,
            Category: Category.value.toLowerCase()
        }


        // add the product if and only if when it in create mood
        if (mood === 'create') {
            if (objProduct.count > 0 && objProduct.count <= 100) {
                for (var i = 0; i < objProduct.count; i++) {
                    arrProduct.push(objProduct);
                }
                swal(`Products added successfully!`, `${objProduct.count} Items  are Added`, "success");
                clearData();

            } else {
                swal("Invalid count number", `Add count number between 1 and 100`, "error");
            }
        } else {
            // update the product
            arrProduct[temp].title = objProduct.title;
            arrProduct[temp].price = objProduct.price;
            arrProduct[temp].taxes = objProduct.taxes;
            arrProduct[temp].ads = objProduct.ads;
            arrProduct[temp].Discount = objProduct.Discount;
            arrProduct[temp].total = objProduct.total;
            swal("Product " + temp + " updated successfully!", `New item is ${objProduct.title}`, "success");
            mood = 'create';
            submit.innerHTML = 'Add Product'
            count.style.display = 'block'
            clearData();
        }

        // save in local storage
        localStorage.setItem('Product', JSON.stringify(arrProduct));
        // clear all inputs 
        // showing data
        showData();
        getTotal()
    } else {
        swal("All fields are required", "please , fill the all felids ", "error");
    }

}

//clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    Discount.value = '';
    Category.value = '';
    count.value = '';
}



//read data 
function showData() {
    // clear table before adding products
    var table = '';
    var cards = ''
    // loop through all products
    for (var i = 0; i < arrProduct.length; i++) {
        table += `
        <tr>
        <td>${i + 1}</td>
        <td>${arrProduct[i].title}</td>
        <td>${arrProduct[i].price}</td>
        <td>${arrProduct[i].taxes}</td>
        <td>${arrProduct[i].ads}</td>
        <td>${arrProduct[i].Discount}</td>
        <td>${arrProduct[i].total}</td>
        <td>${arrProduct[i].Category}</td>
        <td><button onclick=updateItem(${i})>Edit</button></td>
        <td><button onclick=deleteItem(${i},'${arrProduct[i].title}')>Delete</button></td>
        </tr>`
        cards += `
        <div id="productCard" class="card">
                <div class="right">
                    <p>${arrProduct[i].title}</p>
                    <p>${arrProduct[i].Category}</p>
                    <p>${arrProduct[i].price}</p>
                    <button onclick=updateItem(${i})>Edit</button>
                    <button onclick=deleteItem(${i},'${arrProduct[i].title}')>Delete</button>
                </div>
                <div class="left">
                    <p>Taxes ${arrProduct[i].taxes} EGP</p>
                    <p>ADS ${arrProduct[i].ads} EGP</p>
                    <p>Discount ${arrProduct[i].Discount} %</p>
                    <p>Total ${arrProduct[i].total} EGP</p>
                </div>
            </div>`
    }
    document.getElementById('productTable').innerHTML = table;
    document.getElementById('productCard').innerHTML = cards;

    // create clear button for deleting all products
    if (arrProduct.length > 0) {
        document.getElementById('clearBtn').innerHTML = `
        <button onclick='deleteAll(${arrProduct.length + 1})'>Delete All (${arrProduct.length}) </button>`;
    } else
        document.getElementById('clearBtn').innerHTML = '';
}
showData()


// delete item from product
function deleteItem(item, title) {
    swal({
        title: "Are you sure?",
        text: `Your are going to delete ${title}`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                // remove item from array 
                arrProduct.splice(item, 1);
                // update local storage because they are reference to each other
                localStorage.Product = JSON.stringify(arrProduct);
                showData();

                swal("Your Product has been deleted!", {
                    icon: "success",
                });
            }
        });

}

//delete all products 
function deleteAll(numberOfProducts) {
    swal({
        title: `Are you sure to Delete ${numberOfProducts} items ?`,
        text: "Once deleted, you will not be able to recover all Products!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                // clear array and local storage
                arrProduct = []; // remove all products or  arrproducts.splice(0);
                localStorage.clear()
                showData();

                swal("All Your Products has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your Products is safe!");
            }
        });


}

// update
function updateItem(id) {
    // get values from form 
    title.value = arrProduct[id].title;
    Category.value = arrProduct[id].Category;
    price.value = arrProduct[id].price;
    taxes.value = arrProduct[id].taxes;
    ads.value = arrProduct[id].ads;
    Discount.value = arrProduct[id].Discount;
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    temp = id;
    mood = 'update';
    getTotal(); // get total by itself
    // scrollTo(0,0);
    scroll({
        top: 0,
        behavior: "smooth"
    })
}


// search for items
//  get search mode 
var searchMood = 'title';
function getSearchMood(obj) {
    showData();
    var search = document.getElementById('search')
    search.value = '';
    if (obj.id == 'searchByTitle') {
        searchMood = 'title'
        document.getElementById('searchByTitle').style.backgroundColor = 'var(--primary-color)'
        document.getElementById('searchByCategory').style.backgroundColor = 'var(--third-color)'
    } else {
        searchMood = 'category';
        document.getElementById('searchByTitle').style.backgroundColor = 'var(--third-color)'
        document.getElementById('searchByCategory').style.backgroundColor = 'var(--primary-color)'
    }
    search.placeholder = obj.innerText
    search.focus();
    return searchMood
}

// search function
function searchItem(value) {
    var table = ''
    for (var i = 0; i < arrProduct.length; i++) {
        if (arrProduct[i].title.includes(value.toLowerCase()) && searchMood == 'title') {
            table += `
            <tr>
            <td>${i}</td>
            <td>${arrProduct[i].title}</td>
            <td>${arrProduct[i].price}</td>
            <td>${arrProduct[i].taxes}</td>
            <td>${arrProduct[i].ads}</td>
            <td>${arrProduct[i].Discount}</td>
            <td>${arrProduct[i].total}</td>
            <td>${arrProduct[i].Category}</td>
            <td><button onclick=updateItem(${i})>Edit</button></td>
            <td><button onclick=deleteItem(${i},'${arrProduct[i].title}')>Delete</button></td>
            </tr>`
        } else if (arrProduct[i].Category.includes(value.toLowerCase()) && searchMood == 'category') {
            table += `
            <tr>
            <td>${i}</td>
            <td>${arrProduct[i].title}</td>
            <td>${arrProduct[i].price}</td>
            <td>${arrProduct[i].taxes}</td>
            <td>${arrProduct[i].ads}</td>
            <td>${arrProduct[i].Discount}</td>
            <td>${arrProduct[i].total}</td>
            <td>${arrProduct[i].Category}</td>
            <td><button onclick=updateItem(${i})>Edit</button></td>
            <td><button onclick=deleteItem(${i},'${arrProduct[i].title}')>Delete</button></td>
            </tr>`
        }
        document.getElementById('productTable').innerHTML = table;
    }

}

// clean data