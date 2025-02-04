import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // For React Native
import ePub from 'epubjs'; // For EPUB handling
import pdfjsLib from 'pdfjs-dist'; // For PDF parsing (Web)

export const extractTextFromDocument = async () => {
  try {
    // Open document picker dialog
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/epub+zip', 'text/plain'],
    });

    if (result.canceled) return null;

    const { uri, mimeType, name } = result.assets[0];

    if (Platform.OS === 'web') {
      // For Web: Use fetch and FileReader
      const fileResponse = await fetch(uri);
      const fileBlob = await fileResponse.blob();

      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onloadend = async () => {
          const fileData = fileReader.result;

          if (mimeType === 'application/pdf') {
            const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(fileData) });
            const pdfDoc = await loadingTask.promise;
            let textContent = '';

            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i);
              const text = await page.getTextContent();
              textContent += text.items.map(item => item.str).join(' ');
            }
            resolve(textContent);
          } 
          else if (mimeType === 'application/epub+zip') {
            const book = ePub(fileData);
            const rendition = book.renderTo(document.createElement('div'), { width: 600, height: 400 });
            await book.ready;
            const spineItem = book.spine.get(0);
            const text = await spineItem.load(book.load.bind(book)).then(section => section.text);
            resolve(text);
          } 
          else {
            resolve(new TextDecoder().decode(fileData));
          }
        };

        fileReader.onerror = (error) => reject(error);
        fileReader.readAsArrayBuffer(fileBlob);
      });
    }

    // For React Native
    const fileData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (mimeType === 'application/pdf') {
      const pdfData = await pdfjsLib.getDocument({ data: Buffer.from(fileData, 'base64') }).promise;
      let textContent = '';

      for (let i = 1; i <= pdfData.numPages; i++) {
        const page = await pdfData.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(item => item.str).join(' ');
      }
      return textContent;
    } 
    else if (mimeType === 'application/epub+zip') {
      const book = ePub(uri);
      await book.ready;
      const spineItem = book.spine.get(0);
      const text = await spineItem.load(book.load.bind(book)).then(section => section.text);
      return text;
    } 
    else {
      return Buffer.from(fileData, 'base64').toString('utf-8');
    }

  } catch (error) {
    console.error('Error reading document:', error);
    return null;
  }
};
