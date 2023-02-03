import { useRef } from 'react';
// import jsPDF from 'jspdf';
import TemplatePage from './previewTemplate'

// function App() {
// 	const reportTemplateRef = useRef(null);

// 	const handleGeneratePdf = () => {
// 		const doc = new jsPDF({
// 			format: 'a4',
// 			unit: 'px',
// 		});

// 		// Adding the fonts.
// 		doc.setFont('Inter-Regular', 'normal');

// 		doc.html(reportTemplateRef.current, {
// 			async callback(doc) {
// 				await doc.save('document');
// 			},
// 		});
// 	};

// 	return (
// 		<div>
// 			<button className="button" onClick={handleGeneratePdf}>
// 				Generate PDF
// 			</button>
// 			<div ref={reportTemplateRef}>
// 				<ReportTemplate />
// 			</div>
// 		</div>
// 	);
// }

// export default App;