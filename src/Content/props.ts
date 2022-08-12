export const style = document.createElement("style");
style.innerHTML = `
            #d-comments-wrapper {
              display:flex;
              width:100%;
              height:100%;
              z-index:1;
            }
            #d-comments-container {
              z-index:1;
              width:300px;
              display:flex;
              flex-direction:column;
              overflow:hidden;
              overflow-y:scroll;
              color:white;
            }
            #d-comments-container ::-webkit-scrollbar {
              display: none;
            }
            #d-comments-container #d-comments-watch {
              text-align:center;
            }
            #d-comments-container ul {
              margin-block-start:0px;
              margin-block-end:0px;
              padding-inline-start:0px;
              z-index:1;
              list-style:none;
              overflow:hidden;
              overflow-y:scroll;
            }
            #d-comments-container ul li {
              font-size:16px;
              padding:5px;
              border-bottom:1px solid rgb(12 0 193);
            }
            *::-webkit-scrollbar {
              display: none;
            }
            `;
