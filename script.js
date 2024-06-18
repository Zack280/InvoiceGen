document.addEventListener('DOMContentLoaded', function() {
    const invoiceFormService = document.getElementById('invoiceFormService');

    if (invoiceFormService) {
        invoiceFormService.addEventListener('submit', function(event) {
            event.preventDefault();

            const clientName = document.getElementById('clientNameService').value;
            const clientAddress = document.getElementById('clientAdressService').value;
            const serviceName = document.getElementById('serviceName').value;
            const price = parseFloat(document.getElementById('price').value);
            const logoFile = document.getElementById('logoService').files[0];

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            function addInvoiceContent(doc) {
                doc.setFontSize(24);
                doc.setTextColor(40);
                doc.setFont("helvetica", "bold");
                doc.text("INVOICE", 10, 30);
            
                doc.setFontSize(12);
                doc.setTextColor(100);
            
                // Invoice content
                doc.text(`Client Name: ${clientName}`, 10, 50);
                doc.text(`Client Address: ${clientAddress}`, 10, 60);
                doc.text(`Service Name: ${serviceName}`, 10, 70);
                doc.text(`Price: ${price.toFixed(2)} $`, 10, 80);
            
                // Example autoTable usage:
                doc.autoTable({
                    startY: 90,
                    head: [['Service', 'Client', 'Price']],
                    body: [
                        [serviceName, clientName, `${price.toFixed(2)} $`]
                    ],
                });
            
                doc.save('invoice.pdf');
            }

            function openPdf(doc) {
                const pdf = doc.output('blob');
                const url = URL.createObjectURL(pdf);
                window.open(url);
            }

            if (logoFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    doc.addImage(e.target.result, 'JPEG', 150, 10, 50, 20);
                    addInvoiceContent(doc);
                    openPdf(doc);
                };
                reader.readAsDataURL(logoFile);
            } else {
                addInvoiceContent(doc);
                openPdf(doc);
            }
        });
    }
});
