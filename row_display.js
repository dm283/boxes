    const rows = 7;
    const levels = 5;
    const place_levels = 2; const place_level_places = [];
    place_level_places[0] = 3;
    place_level_places[1] = 4;

    var th_rowspan_row = place_levels+1;
    var th_colspan_place = 1
    for (let i=0; i<place_levels; i++) {
      th_colspan_place *= place_level_places[i]
    }

    // create cell matrix data-structure and fill it with 0-values
    // cell_matrix = [];
    // for (i=1; i<=rows; i++) {
    //   cell_matrix[i] = []
    //   for (j=1; j<=levels; j++) {
    //     cell_matrix[i][j] = []
    //     for (k=1; k<=th_colspan_place; k++) {
    //       cell_matrix[i][j][k] = []
    //       cell_matrix[i][j][k]['order'] = 100+i+j+k;
    //       cell_matrix[i][j][k]['status'] = 0;
    //     }
    //   }
    // }
    
    td_color = [];
    td_color[0] = 'green';
    td_color[1] = 'yellow';
    td_color[2] = 'red';

    function render_thead_tr(n) {
      //
      var thead_tr = ''
      if (n > 0) { 
        perv_level_places = place_level_places[n-1]
      }
      else {
        perv_level_places = 1
      }
      places = place_level_places[n] * perv_level_places

      if ( n < (place_levels-1) ) {
        colspan_str = ` colspan="${place_level_places[n+1]}"`
      }
      else {
        colspan_str = ''
      }
      for (let i=0; i<places; i++) {
        thead_tr += `<th${colspan_str}>${i+1}</th>`
      }

      return thead_tr
    }

    var thead = ''
    for (let i=0; i<place_levels; i++) {
      tr_content = render_thead_tr(i);
      thead += ('<tr>' + tr_content + '</tr>');
    }


    function render_modal(row, level, place) {
      // Modal content
      is_selected = []
      is_selected[cell_matrix[row][level][place]['status']] = 'selected'

      modal_content = `<div class="modal-content">
        <span class="close" onclick="close_modal()">&times;</span>

        <form id="cell_data_form" name="cell_data_form" action="" method="POST">
          <label for="order_input">ЗАКАЗ</label>
          <input type="text" id="order_input" name="order" value="${cell_matrix[row][level][place]['order']}"><br><br>
          <label for="status_input">СТАТУС</label>
          <select id="status_input" name="status">
            <option value="0"${is_selected[0]}>0</option>
            <option value="1"${is_selected[1]}>1</option>
            <option value="2"${is_selected[2]}>2</option>
          </select>
          <br><br><br>
          <input type="submit" value="SUBMIT">
        </form>

      </div>`
      document.getElementById("myModal").innerHTML = modal_content

      //
      document.getElementById("cell_data_form").addEventListener("submit", function (e) {
        e.preventDefault();

        var formData = new FormData(e.target);
        // output as an object
        //console.log(Object.fromEntries(formData));

        // ...or iterate through the name-value pairs
        for (var pair of formData.entries()) {
          //console.log(pair[0] + ": " + pair[1]);
          cell_matrix[row][level][place][pair[0]] = pair[1]
        }
        //console.log(cell_matrix[row][level][place])
        close_modal();
        });
    }


    // Get the modal
    var modal = document.getElementById("myModal");

    function cell_click(row, level, place) {
      //
      modal.style.display = "block";
      render_modal(row, level, place);
    }

    function close_modal() {
      modal.style.display = "none";
      render_table()
    }


    function render_line_cells(row, level) {
      //
      line_content_cells = ''
      for (let i=1; i<=th_colspan_place; i++) {
        line_content_cells += `<td 
        onclick='cell_click(${row}, ${level}, ${i})'
        bgcolor=${td_color[cell_matrix[row][level][i]['status']]}
        >
          ${cell_matrix[row][level][i]['order']}
          </td>`
      }
      return line_content_cells
    }

    function render_line_sideheader(row, level) {
      rowsideheader_str = ''
      if (level == 1) {
        rowsideheader_str = `<td rowspan="${levels}"><b>${row}</b></td>`
      }
      line_content_sideheader = `${rowsideheader_str}<td><b>${level}</b></td>`
      return line_content_sideheader
    }

    function create_tbody() {
      //
      var tbody = ''
      const y = rows * levels
      for (let i=1; i<=rows; i++) {
        for (let j=1; j<=levels; j++) {
          line_content_sideheader = render_line_sideheader(i, j)
          line_content_cells = render_line_cells(i, j)
          line_content = line_content_sideheader + line_content_cells
          tbody += ('<tr>' + line_content + '</tr>');
        }
      }
      
      return tbody
    }


    function render_table() {
        //
      var tbody = create_tbody();
      var storage_matrix = `
        <table>
          <thead>
            <tr>
              <th rowspan='${th_rowspan_row}'>ряд</th>
              <th rowspan='${th_rowspan_row}'>ярус</th>
              <th colspan='${th_colspan_place}'>место</th>
            </tr>
            ${thead}
          </thead>

          <tbody>
            ${tbody}
          </tbody>
        </table>
      `
      document.getElementById("storage_matrix").innerHTML = storage_matrix
    }
