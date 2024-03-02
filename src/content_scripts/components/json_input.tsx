// function file_input_handler() {
//   const [file] = input.current?.files || [null];

//   const reader = new FileReader();
//   reader.onload = () => {
//     const result = reader.result?.toString();
//     if (!result) return;
//     load_comments_from_json(result).catch((e) =>
//       ErrorMessage(toast, { error: e })
//     );
//   };

//   if (file) reader.readAsText(file);
// }
