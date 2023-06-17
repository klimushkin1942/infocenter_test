$(document).ready(function() {
  loadKettles();
  
  $('#addKettle').submit(function(e) {
    e.preventDefault();
    var brand = $('input[name="brand"]').val();
    var model = $('input[name="model"]').val();
    var price = $('input[name="price"]').val();
    addKettle(brand, model, price);
  });

  $(document).on('click', '.delete-button', function() {
    var kettleId = $(this).data('id');
    deleteKettle(kettleId);
  });
  

  $(document).on('click', '.update-button', function() {
    var kettleId = $(this).data('id');
    loadKettle(kettleId);
    $('#updateKettle').submit(function(e) {
      e.preventDefault();
      var newBrand = $('input[name="update-brand"]').val();
      var newModel = $('input[name="update-model"]').val();
      var newPrice = $('input[name="update-price"]').val();
      updateKettle(kettleId, newBrand, newModel, newPrice);
      setTimeout(() => {
        loadKettles();
      }, 1500);
    });
  });
});

function loadKettle(kettleId) {
  $.ajax({
    url: 'api.php?id=' + kettleId,
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      $('input[name="update-brand"]').val(response.brand);
      $('input[name="update-model"]').val(response.model);
      $('input[name="update-price"]').val(response.price);
    },
    error: function(error) {
      console.log('Произошла ошибка при получении информации о чайнике:', error);
    }
  });
}

function loadKettles() {
  $.ajax({
    url: 'api.php',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      
      $('#kettleList tbody').empty();
      
      $.each(response, function(index, kettle) {
        var row = '<tr>' +
          '<td>' + kettle.brand + '</td>' +
          '<td>' + kettle.model + '</td>' +
          '<td>' + kettle.price + ' руб.</td>' +
          '<td><button class="btn btn-danger delete-button" data-id="' + kettle.id + '">Удалить</button></td>' +
          '<td><button class="btn btn-secondary update-button" data-id="' + kettle.id + '">Изменить</button></td>' +  
          '</tr>';
        $('#kettleList tbody').append(row);
      });
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function addKettle(brand, model, price) {
  $.ajax({
    url: 'api.php',
    method: 'POST',
    dataType: 'json',
    data: {
      'brand': brand,
      'model': model,
      'price': price
    },
    success: function(response) {
      setTimeout(() => {
        loadKettles();
      }, 1500);
      
      $('input[name="brand"]').val('');
      $('input[name="model"]').val('');
      $('input[name="price"]').val('');
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function deleteKettle(kettleId) {
  $.ajax({
    url: 'api.php?id=' + kettleId,
    method: 'DELETE',
    success: function(response) {
      loadKettles();
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function updateKettle(kettleId, newBrand, newModel, newPrice) {
  $.ajax({
    url: 'api.php/' + kettleId,
    method: 'PUT',
    dataType: 'json',
    data: {
      'id'    : kettleId,
      'brand' : newBrand,
      'model' : newModel,
      'price' : newPrice
    },
    success: function(response) {
      console.log('Чайник успешно изменен!');
    },
    error: function(error) {
      console.log(error);
    }
  })
}
