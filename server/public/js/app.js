"use strict"
//flexslider
$(window).load(function(){
		  $('.flexslider').flexslider({
			animation: "slide",
			start: function(slider){
			  $('body').removeClass('loading');
			}
		  });
});// JavaScript Document
//end flexslider

$("#btnSearch").click(function(){
	var searchString = $("#search-string").val();
	$('.list-products').toggle();
	$('.loading').toggle();
	
	$.ajax({
		method: 'POST',
		url: '/api/search',
		data: {
			productName: searchString
		},
		dataType: 'json',
		success: function(json){
			
			var products = json.products;
			console.log(products);
			console.log($('.list-products').html())
			$('.list-products').empty();
			var html = "";
			
			for(var i =0; i< products.length; i ++) {
				html += '<div class="col-lg-4 col-sm-6">'
				html += 	'<div class="product-box">'
				html += 		'<h3 class = "text-success">' + products[i].name + '</h3>';
				html += 		'<a href="/product/detail/' + products[i]._id + '"><img src="' + products[i].image + '"  alt="' +  products[i].name +'"></a>';
				html += 		'<div class="product-overlay">'	;
		        html += 			'<a href="#" class="add-to-cart"><i class="fa fa-cart-plus"></i></a>'     ;       	
		        html += 			'<a href="' + products[i].image + '" class="gallery-zoom" data-lightbox="ajax"><i class="fa fa-search"></i></a>';               
		        html += 		'</div>';           
				html += 		'<div class="product-desc">';			
				html += 			' <div class="editContent" style="outline: none; cursor: inherit;">';			
				html += 				'<h4><del>' + Math.floor(products[i].price * 1.2) + 'VND </del>' + products[i].price + ' VND</h4> ';			
				html += 			'</div> ';			
				html += 			'<div class="product-rating"> ';			
				html += 				'<i class="fa fa-star"></i> ';			
				html += 				'<i class="fa fa-star"></i> ';			
				html += 				'<i class="fa fa-star"></i> ';			
				html += 				'<i class="fa fa-star"></i> ';			
				html += 				'<i class="fa fa-star"></i> ';			
				html += 			'</div> ';			
				html += 		' </div>';			
				html += 		'<a class="btn btn-success">Đặt hàng</a> ';			
				html += 		'<a class = "btn btn-primary" href="/product/detail/' + products[i]._id + '">Chi Tiết</a> ';			
				html += 	'</div>';
				html += '</div>';		
			}
			
			$('.list-products').append(html);
			$('.list-products').toggle();
			$('.loading').toggle();
		},
		error: function(err){
			console.log(err);
		}
	});
});
//===================================================================
//	Cart
//===================================================================
$("#cartMessage").fadeOut();
$("#cartError").fadeOut();
var minusCartButton = $("#cart .minusQuanity");
var addCartButton = $("#cart .addQuanity");
var listItem = [];
var caculateTotal = function() {
	
	var items = $("#cart .cart");
	var totalPrice = 0;
	var tempTotal = 0;
	for(var i = 0; i < items.length; i++){
		if(items[i].id == "cartQuantity"){
			tempTotal = items[i].value;
		}
		else if(items[i].id == "cartPrice") {
			tempTotal = tempTotal * parseFloat(items[i].value);
			totalPrice += tempTotal;
			tempTotal = 0;
		}
		
		// totalPrice += parseInt(items[i].html()) * parseInt(items[i].parent().children('.cartPrice').val());
	}
	
	$("#cart #TotalPriceNotVat").html("Tổng Tiền: " + totalPrice + " VNĐ");
	$("#cart #totalVat").html("Tổng Tiền: " + Math.floor(totalPrice *0.1) + " VNĐ");
	$("#cart #totalPriceIncludeVat").html( Math.floor(totalPrice*1.1));
}

addCartButton.click(function(){
	 var quantity = parseInt($(this).parent().children(".cartQuantity").val());
	 quantity ++;
	 $(this).parent().children(".cartQuantity").val(quantity);
	 caculateTotal();
});
minusCartButton.click(function(){
	 var quantity = parseInt($(this).parent().children(".cartQuantity").val());
	 if(quantity > 0) {
		 quantity --;
		 $(this).parent().children(".cartQuantity").val(quantity);
		 caculateTotal();
	 }
})

$("#cart form").on( "submit", function( event ) {
  event.preventDefault();
  var $this = $(this);
  var viewArr = $this.serializeArray();
  var item = {};
  var arrData = [];
  var addNewProperties= function(newProperty){
  	if(newProperty.name == "id") {
  		item.id = newProperty.value;
  	}
  	if(newProperty.name == "cartQuantity") {
  		item.quantity = newProperty.value;
  	}
  	if(newProperty.name == "cartPrice") {
  		item.price = newProperty.value;
  	}
  };
  
  for (var i = 0; i <viewArr.length;) {
	addNewProperties( viewArr[i]);
	addNewProperties( viewArr[i+1]);
	addNewProperties( viewArr[i+2]);
	arrData.push(item);
    item = {};
    i +=3;
  }
	$("#cartMessage").fadeOut();
	$("#cartError").fadeOut();
  	$.ajax({
		method: 'POST',
		url: '/api/cartPay',
		data: {
			order: arrData
		},
		dataType: 'json',
		success: function(result){
			$("#cartMessage").text("đã lưu dữ liệu thành công");
			$("#cartMessage").fadeIn(200);
		},
		error: function(err){
			$("#cartError").text(err);
			$("#cartError").fadeIn(200);
		}
  	});
});

//=======================================================
//end cart form
//=======================================================