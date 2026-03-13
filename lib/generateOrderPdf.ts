import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/lib/api';

export const generateOrderPdf = async (order: any, isVendor: boolean) => {
  const doc = new jsPDF();

  // Helper variables
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;

  // Header - Store Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(219, 39, 119); // Theme Pink
  doc.text('Agnipengal', pageWidth / 2, 20, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Empowering Women Entrepreneurs', pageWidth / 2, 26, { align: 'center' });

  // Invoice Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text('Invoice', marginLeft, 40);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Order ID: #${order._id.substring(0, 8)}`, marginLeft, 48);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, marginLeft, 53);
  doc.text(`Payment Status: ${order.status === 'PAID' ? 'PAID' : 'PENDING'}`, marginLeft, 58);

  // Addresses
  doc.setFontSize(12);
  doc.setTextColor(40);

  // Vendor/Admin Address (From)
  doc.setFont('helvetica', 'bold');
  doc.text('From:', marginLeft, 73);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  if (isVendor) {
    let vendorName = order.items?.[0]?.vendorName || 'Vendor';
    try {
      const profileRes = await api.get('/vendors/profile');
      if (profileRes.data?.data?.storeName) {
        vendorName = profileRes.data.data.storeName;
      }
    } catch (error) {
      console.error('Error fetching vendor profile for PDF:', error);
    }
    doc.text(vendorName, marginLeft, 80);
  } else {
    doc.text('Agnipengal', marginLeft, 80);
    doc.text('Admin Store', marginLeft, 85);
  }

  // Customer Address (To)
  const rightColumnX = pageWidth / 2 + 10;
  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To / Ship To:', rightColumnX, 73);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  if (order.customer) {
    doc.text(order.customer.name || 'N/A', rightColumnX, 80);
    doc.text(`${order.customer.address || ''}`, rightColumnX, 85);
    doc.text(`${order.customer.city || ''}, ${order.customer.state || ''}`, rightColumnX, 90);
    doc.text(`${order.customer.country || ''} - ${order.customer.pincode || ''}`, rightColumnX, 95);
    doc.text(`Phone: ${order.customer.mobile || 'N/A'}`, rightColumnX, 100);
    doc.text(`Email: ${order.customer.email || 'N/A'}`, rightColumnX, 105);
  }

  // Items Table
  const tableData = order.items.map((item: any) => [
    item.product?.name || item.name || 'Product Details Unavailable',
    !isVendor ? item.vendorName || 'Main Store' : '', // Conditional vendor column
    item.quantity?.toString() || '0',
    `Rs. ${item.price?.toFixed(2) || '0.00'}`,
    `Rs. ${(item.price * item.quantity)?.toFixed(2) || '0.00'}`,
  ]);

  const headers = ['Product', !isVendor ? 'Vendor' : '', 'Qty', 'Unit Price', 'Total'].filter(
    Boolean,
  );

  // Filtering out empty strings from tableData rows if isVendor is true to match header length
  const filteredTableData = tableData.map((row: any[]) => row.filter((cell: any) => cell !== ''));

  autoTable(doc, {
    startY: 115,
    head: [headers],
    body: filteredTableData,
    theme: 'striped',
    headStyles: { fillColor: [219, 39, 119] }, // Pink color to match theme
    margin: { left: marginLeft, right: marginLeft },
  });

  // Totals Area
  const finalY = (doc as any).lastAutoTable.finalY || 115;
  const totalsX = pageWidth - marginLeft - 60;
  const amountsX = pageWidth - marginLeft;

  doc.setFontSize(10);
  doc.setTextColor(60);

  let currentY = finalY + 15;
  const rowHeight = 7;

  if (isVendor) {
    doc.text('Vendor Subtotal:', totalsX, currentY);
    doc.text(`Rs. ${order.vendorSubTotal?.toFixed(2) || '0.00'}`, amountsX, currentY, {
      align: 'right',
    });
    currentY += rowHeight;

    doc.text('Shipping Share:', totalsX, currentY);
    doc.text(`+ Rs. ${order.vendorShippingTotal?.toFixed(2) || '0.00'}`, amountsX, currentY, {
      align: 'right',
    });
    currentY += rowHeight;

    if (order.discount > 0) {
      doc.setTextColor(22, 163, 74); // Green
      doc.text(`Discount ${order.couponCode ? `(${order.couponCode})` : ''}:`, totalsX, currentY);
      doc.text(`- Rs. ${order.discount?.toFixed(2) || '0.00'}`, amountsX, currentY, {
        align: 'right',
      });
      doc.setTextColor(60);
      currentY += rowHeight;
    }

    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Vendor Total:', totalsX, currentY + 2);
    doc.text(
      `Rs. ${(order.vendorGrandTotal || order.vendorSubTotal || 0).toFixed(2)}`,
      amountsX,
      currentY + 2,
      { align: 'right' },
    );
  } else {
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsX, currentY);
    doc.text(
      `Rs. ${(order.subTotal || order.totalAmount)?.toFixed(2) || '0.00'}`,
      amountsX,
      currentY,
      { align: 'right' },
    );
    currentY += rowHeight;

    doc.text('Shipping Charge:', totalsX, currentY);
    doc.text(
      order.shippingCharge ? `+ Rs. ${order.shippingCharge.toFixed(2)}` : 'Free',
      amountsX,
      currentY,
      { align: 'right' },
    );
    currentY += rowHeight;

    if (order.discount > 0) {
      doc.setTextColor(22, 163, 74); // Green
      doc.text(`Discount ${order.couponCode ? `(${order.couponCode})` : ''}:`, totalsX, currentY);
      doc.text(`- Rs. ${order.discount?.toFixed(2) || '0.00'}`, amountsX, currentY, {
        align: 'right',
      });
      doc.setTextColor(60);
      currentY += rowHeight;
    }

    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', totalsX, currentY + 2);
    doc.text(`Rs. ${order.totalAmount?.toFixed(2) || '0.00'}`, amountsX, currentY + 2, {
      align: 'right',
    });
  }

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 30, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100);
  // Social Media Links in Footer
  doc.text('Instagram: @agnipengal  |   Facebook: /agnipengal', pageWidth / 2, pageHeight - 20, {
    align: 'center',
  });
  doc.text(
    'Website: www.agnipengal.com  |   Email: agnipengal16@gmail.com',
    pageWidth / 2,
    pageHeight - 14,
    { align: 'center' },
  );

  // Save the PDF
  doc.save(`Invoice_#${order._id.substring(0, 8)}.pdf`);
};
