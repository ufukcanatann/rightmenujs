$(document).ready(function() {
    
    // Initialize the RightMenu plugin
    const fileMenu = new RightMenu({
        selector: '.rightmenu-trigger',
        items: [
            { 
                label: 'Önizle', 
                icon: 'fa-regular fa-eye', 
                action: (data) => alert('Önizleniyor: ' + data.name) 
            },
            { 
                label: 'Birlikte aç', 
                icon: 'fa-solid fa-arrow-up-right-from-square', 
                action: (data) => alert('Açılıyor: ' + data.name) 
            },
            { separator: true },
            { 
                label: 'Paylaş', 
                icon: 'fa-solid fa-user-plus', 
                action: (data) => alert(data.name + ' dosyası için paylaşım ayarları açıldı.') 
            },
            { 
                label: 'Bağlantıyı al', 
                icon: 'fa-solid fa-link', 
                action: (data) => alert('Bağlantı kopyalandı: https://drive.clone/file/' + data.id) 
            },
            { separator: true },
            { 
                label: 'Yeniden adlandır', 
                icon: 'fa-solid fa-pen', 
                action: (data, target) => {
                    var newName = prompt('Yeniden adlandır:', data.name);
                    if (newName && newName.trim() !== "") {
                        // Update data attribute
                        $(target).data('name', newName);
                        // Update UI (keeping the icon)
                        var iconHtml = $(target).find('td:first i').prop('outerHTML');
                        $(target).find('td:first').html(iconHtml + ' ' + newName);
                    }
                }
            },
            { 
                label: 'Ayrıntıları göster', 
                icon: 'fa-solid fa-circle-info', 
                action: (data, target) => {
                    var owner = $(target).find('td:nth-child(2)').text();
                    var details = `Dosya Detayları:\n\nAdı: ${data.name}\nTür: ${data.type}\nID: ${data.id}\nSahibi: ${owner}`;
                    alert(details);
                }
            },
            { separator: true },
            { 
                label: 'Kaldır', 
                icon: 'fa-regular fa-trash-can', 
                className: 'danger',
                action: (data, target) => {
                    if (confirm(data.name + ' dosyasını silmek istediğinize emin misiniz?')) {
                        $(target).remove();
                    }
                }
            }

        ],
        onShow: (target) => {
             $(target).addClass('rightmenu-active');
        },
        onHide: (target) => {
             $(target).removeClass('rightmenu-active');
        }
    });

    // Optional: Add styling for the active state (handled by plugin adding 'rightmenu-active' class)
    // Note: We handled it manually above via onShow/onHide hooks.
});
