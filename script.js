
$(document).ready(function () {
    // Функция для получения токена пользователя
    function getUserToken() {
        return localStorage.getItem('userToken');
    }

    // Функция для отображения пользователей в таблице
    function displayUsers(userList) {
        var userTableBody = $('#userTableBody');
        // Очищаем таблицу от предыдущих строк
        userTableBody.empty();
        // Проверяем, является ли userList массивом
        if (Array.isArray(userList)) {
            // Проходимся по списку пользователей и добавляем их в таблицу
            userList.forEach(function (user) {
                var row = '<tr>' +
                    '<td>' + user.id + '</td>' +
                    '<td>' + user.email + '</td>' +
                    '<td>' + (user.age || '') + '</td>' + // Возраст
                    '<td>' + user.role + '</td>' +
                    '<td class="text-center">' +
                    '<button type="button" class="btn btn-sm btn-primary edit-btn" data-id="' + user.id + '">Редактировать</button>' +
                    '<button type="button" class="btn btn-sm btn-danger delete-btn" data-id="' + user.id + '">Удалить</button>' +
                    '</td>' +
                    '</tr>';
                userTableBody.append(row);
            });
        } else {
            console.error("userList is not an array:", userList);
        }
    }


    // Функция для отображения медиафайлов в таблице
    function displayMedia(mediaList) {
        var mediaTableBody = $('#mediaTableBody');
        // Очищаем таблицу от предыдущих строк
        mediaTableBody.empty();
        // Проверяем, является ли mediaList массивом
        if (Array.isArray(mediaList)) {
            // Проходимся по списку медиафайлов и добавляем их в таблицу
            mediaList.forEach(function (media) {
                var row = '<tr>' +
                    '<td>' + media.id + '</td>' +
                    '<td>' + media.src + '</td>' +
                    '<td>' + media.type + '</td>' +
                    '<td class="text-center">' +
                    '<button type="button" class="btn btn-sm btn-primary edit-btn" data-id="' + media.id + '">Редактировать</button>' +
                    '<button type="button" class="btn btn-sm btn-danger delete-btn" data-id="' + media.id + '">Удалить</button>' +
                    '</td>' +
                    '</tr>';
                mediaTableBody.append(row);
            });
        } else {
            console.error("mediaList is not an array:", mediaList);
        }
    }


    // Отправляем GET запрос для получения медиафайлов
    $.ajax({
        url: 'http://localhost:3000/admin/media',
        type: 'GET',
        headers: {
            "Authorization": "Bearer " + getUserToken()
        },
        contentType: 'application/json',
        success: function (response) {
            if (Array.isArray(response)) {
                displayMedia(response);
            } else {
                console.error("Response is not an array:", response);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch media:", error);
            console.log("Response:", xhr.responseText);
            // Здесь можно добавить код для обработки ошибки при загрузке медиафайлов
        }
    });


    // Обработчик клика по кнопке "Редактировать"
    $(document).on('click', '.edit-btn', function () {
        // Получаем ID медиафайла из атрибута data-id кнопки
        var mediaIdToEdit = $(this).data('id');
        // Получаем данные о медиафайле по его ID и заполняем поля модального окна
        $.ajax({
            url: 'http://localhost:3000/admin/media/' + mediaIdToEdit,
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            success: function (response) {
                // Заполняем поля модального окна данными о медиафайле
                $('#editSrcInput').val(response.src);
                $('#editTypeInput').val(response.type);
                // Устанавливаем значение mediaId в атрибут data-id модального окна
                $('#editMediaModal').attr('data-id', mediaIdToEdit);
                // Открываем модальное окно
                $('#editMediaModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch media:", error);
            }
        });
    });

    // Обработчик для сохранения изменений в медиафайле
    $('#saveChangesBtn').click(function () {
        // Получаем ID медиафайла из атрибута data-id модального окна
        var mediaId = $('#editMediaModal').attr('data-id');
        // Получаем данные для обновления
        var newData = {
            src: $('#editSrcInput').val(),
            type: $('#editTypeInput').val()
        };
        // Вызываем функцию обновления медиафайла
        updateMedia(mediaId, newData);
        // Закрываем модальное окно
        $('#editMediaModal').modal('hide');
    });


    // Обработчик для открытия модального окна редактирования пользователя
    $(document).on('click', '.edit-user-btn', function () {
        // Получаем ID пользователя из атрибута data-id кнопки
        var userIdToEdit = $(this).data('id');
        // Получаем данные о пользователе по его ID и заполняем поля модального окна
        $.ajax({
            url: 'http://localhost:3000/admin/user/' + userIdToEdit,
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            success: function (response) {
                // Заполняем поля модального окна данными о пользователе
                $('#editUserName').val(response.name);
                $('#editUserAge').val(response.age);
                $('#editUserEmail').val(response.email);
                $('#editUserPassword').val(response.password);
                $('#editUserRole').val(response.role);
                $('#editUserDepartmentId').val(response.department_id);
                // Устанавливаем значение userId в атрибут data-id модального окна
                $('#editUserModal').attr('data-id', userIdToEdit);
                // Открываем модальное окно
                $('#editUserModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch user:", error);
            }
        });
    });


    // Обработчик клика по кнопке "Удалить"
    $(document).on('click', '.delete-btn', function () {
        // Получаем идентификатор медиафайла из атрибута data-id кнопки
        var mediaIdToDelete = $(this).data('id');

        // Отправляем запрос на удаление медиафайла
        $.ajax({
            url: 'http://localhost:3000/admin/media/' + mediaIdToDelete,
            type: 'DELETE',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            success: function (response) {
                console.log("Media deleted successfully:", response);
                // Удаляем отображение медиафайла из таблицы на странице
                // Здесь можно добавить код для удаления строки из таблицы с соответствующим mediaIdToDelete

                // Показываем модальное окно с сообщением об успешном удалении
                $('#deleteSuccessModal').modal('show');

                // Загружаем обновленные данные и обновляем таблицу
                loadDataAndRefreshTable();
            },
            error: function (xhr, status, error) {
                console.error("Failed to delete media:", error);
                // Здесь можно добавить код для обработки ошибки при удалении медиафайла
            }
        });
    });

    // Функция для загрузки данных и обновления таблицы
    function loadDataAndRefreshTable() {
        // Отправляем GET запрос для получения медиафайлов
        $.ajax({
            url: 'http://localhost:3000/admin/media',
            type: 'GET',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            success: function (response) {
                // Отображаем медиафайлы в таблице
                displayMedia(response);
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch media:", error);
            }
        });
    }

    $(document).ready(function () {
        // Проверяем, является ли пользователь администратором
        var userRole = localStorage.getItem('userRole');
        if (userRole === 'Admin') {
            // Если пользователь администратор, то добавляем обработчик клика на иконку пользователя
            $('.navbar-brand img').click(function () {
                window.location.href = 'AdminPanel.html';
            });
        }
    });

    // Обработчик клика по кнопке "Добавить медиафайл"
    $('#addMediaBtn').click(function () {
        // Получаем значения полей ввода
        var mediaSrc = $('#mediaSrc').val();
        var mediaType = $('#mediaType').val();

        // Отправляем POST запрос для добавления нового медиафайла
        $.ajax({
            url: 'http://localhost:3000/admin/media',
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            data: JSON.stringify({
                src: mediaSrc,
                type: mediaType
            }),
            contentType: 'application/json',
            success: function (response) {
                // Закрываем модальное окно
                $('#addMediaModal').modal('hide');
                // Показываем модальное окно с сообщением об успешном добавлении
                $('#addSuccessModal').modal('show');
                // Обновляем таблицу с медиафайлами после успешного добавления
                if (Array.isArray(response)) {
                    response.forEach(function (media) {
                        displayMedia(media);
                    });
                } else {
                    displayMedia(response);
                }
                // Очищаем поля формы после успешной отправки
                $('#mediaSrc').val('');
                $('#mediaType').val('video');
            },
            error: function (xhr, status, error) {
                console.error("Failed to add media:", error);
                console.log("Response:", xhr.responseText);
                // Здесь можно добавить код для обработки ошибки при добавлении медиафайла
            }
        });
    });

    $(document).ready(function () {
        // Обработчик клика на ссылку "Выйти"
        $('#logout a').click(function (event) {
            event.preventDefault();

            // Отправляем запрос на выход из аккаунта
            $.ajax({
                url: 'http://localhost:3000/auth/logout',
                type: 'POST',
                headers: {
                    "Authorization": "Bearer " + getUserToken()
                },
                success: function (response) {
                    // Перенаправляем пользователя на страницу авторизации
                    window.location.href = 'login.html';
                },
                error: function (xhr, status, error) {
                    console.error("Failed to logout:", error);
                }
            });
        });
    });

    // Функция для обновления медиафайла по идентификатору
    function updateMedia(mediaId, newData) {
        // Отправляем запрос на обновление медиафайла
        $.ajax({
            url: 'http://localhost:3000/admin/media/' + mediaId,
            type: 'PUT',
            headers: {
                "Authorization": "Bearer " + getUserToken()
            },
            contentType: 'application/json',
            data: JSON.stringify(newData),
            success: function (response) {
                console.log("Media updated successfully:", response);
                // Здесь можно добавить код для обновления отображения медиафайла на странице
            },
            error: function (xhr, status, error) {
                console.error("Failed to update media:", error);
            }
        });
    }


    // Функция для перенаправления на страницу login.html
    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    // Обработчик ошибки AJAX-запроса
    $(document).ajaxError(function (event, xhr, settings, error) {
        // Проверяем, если ошибка "Unauthorized", то перенаправляем на страницу login.html
        if (xhr.status === 401) {
            console.error('Unauthorized: Redirecting to login page');
            redirectToLogin();
        }
    });
});

