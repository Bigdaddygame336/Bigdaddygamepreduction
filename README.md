# Bigdaddygamepreduction
<script type="text/javascript">
        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }
        </script><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Big Daddy Game Interface</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            width: 100%;
            max-width: 450px;
            padding: 20px;
            box-sizing: border-box;
        }
        .column {
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.1);
            margin-bottom: 20px;
            display: none;
            border: 1px solid #ffd700;
        }
        .column.active {
            display: block;
        }
        .column img, .column video {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
            border: 1px solid #ffd700;
        }
        h2 {
            margin-top: 0;
            color: #ffd700;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
        }
        .submit-btn {
            display: block;
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg, #ffd700, #ffaa00);
            color: #1a1a1a;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(255, 215, 0, 0.5);
        }
        .submit-btn:disabled {
            background: #666666;
            cursor: not-allowed;
        }
        .file-input {
            margin: 10px 0;
            color: #ffffff;
            display: block;
            width: 100%;
        }
        .file-input::-webkit-file-upload-button {
            background: #ffd700;
            color: #1a1a1a;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        #login-interface {
            display: none;
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #ffd700;
        }
        #prediction-interface {
            display: none;
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #ffd700;
        }
        .input-field {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ffd700;
            border-radius: 6px;
            font-size: 16px;
            background: #333333;
            color: #ffffff;
            box-sizing: border-box;
        }
        .input-field::placeholder {
            color: #cccccc;
        }
        .error {
            color: #ff4d4d;
            margin-top: 5px;
            display: none;
            font-size: 14px;
            text-align: center;
        }
        .result {
            margin-top: 20px;
            font-size: 18px;
            color: #ffd700;
            font-weight: bold;
            text-align: center;
        }
        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }
            .column, #login-interface, #prediction-interface {
                padding: 15px;
            }
            .submit-btn {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="deposit-column" class="column active">
            <h2>Deposit Screenshot</h2>
            <input type="file" id="deposit-file" class="file-input" accept="image/*">
            <img id="deposit-preview" src="https://via.placeholder.com/300x200?text=Deposit+Screenshot" alt="Deposit Screenshot">
            <button id="deposit-btn" class="submit-btn" onclick="nextColumn('deposit-column', 'video-column')" disabled>Next</button>
        </div>
        <div id="video-column" class="column">
            <h2>Registration Process Video</h2>
            <input type="file" id="video-file" class="file-input" accept="video/*">
            <video id="video-preview" controls>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button id="video-btn" class="submit-btn" onclick="showLogin()" disabled>Submit</button>
        </div>
        <div id="login-interface">
            <h2>Login Interface</h2>
            <input type="text" id="login-code" class="input-field" placeholder="Enter Approval Code">
            <p id="login-error" class="error">Invalid approval code. Please try again.</p>
            <button class="submit-btn" onclick="checkLogin()">Submit</button>
        </div>
        <div id="prediction-interface">
            <h2>Big Daddy Game Wingo Prediction</h2>
            <input type="text" id="prediction-code" class="input-field" placeholder="Enter last 6 digits" maxlength="6">
            <p id="prediction-error" class="error">Please enter exactly 6 digits.</p>
            <button class="submit-btn" onclick="showPrediction()">Submit</button>
            <div id="prediction-result" class="result"></div>
        </div>
    </div>

    <script>
        // File input handlers for media preview and button enabling
        document.getElementById('deposit-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('deposit-preview').src = e.target.result;
                    document.getElementById('deposit-btn').disabled = false;
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('deposit-btn').disabled = true;
            }
        });

        document.getElementById('video-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const video = document.getElementById('video-preview');
                video.src = URL.createObjectURL(file);
                video.load();
                document.getElementById('video-btn').disabled = false;
            } else {
                document.getElementById('video-btn').disabled = true;
            }
        });

        function nextColumn(currentId, nextId) {
            document.getElementById(currentId).classList.remove('active');
            document.getElementById(nextId).classList.add('active');
        }

        function showLogin() {
            document.getElementById('video-column').style.display = 'none';
            document.getElementById('login-interface').style.display = 'block';
        }

        function checkLogin() {
            const code = document.getElementById('login-code').value;
            const error = document.getElementById('login-error');
            if (code === '448119588622') {
                error.style.display = 'none';
                document.getElementById('login-interface').style.display = 'none';
                document.getElementById('prediction-interface').style.display = 'block';
            } else {
                error.style.display = 'block';
            }
        }

        function showPrediction() {
            const code = document.getElementById('prediction-code').value;
            const error = document.getElementById('prediction-error');
            const result = document.getElementById('prediction-result');
            
            if (/^\d{6}$/.test(code)) {
                error.style.display = 'none';
                const prediction = Math.random() > 0.5 ? 'Big' : 'Small';
                result.textContent = `Prediction: ${prediction}`;
            } else {
                error.style.display = 'block';
                result.textContent = '';
            }
        }
    </script>
</body>
</html><script type="text/javascript">
        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }
        </script><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Big Daddy Game Interface</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            width: 100%;
            max-width: 450px;
            padding: 20px;
            box-sizing: border-box;
        }
        .column {
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.1);
            margin-bottom: 20px;
            display: none;
            border: 1px solid #ffd700;
        }
        .column.active {
            display: block;
        }
        .column img, .column video {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin-top: 10px;
            border: 1px solid #ffd700;
        }
        h2 {
            margin-top: 0;
            color: #ffd700;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
        }
        .submit-btn {
            display: block;
            width: 100%;
            padding: 12px;
            background: linear-gradient(90deg, #ffd700, #ffaa00);
            color: #1a1a1a;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(255, 215, 0, 0.5);
        }
        .submit-btn:disabled {
            background: #666666;
            cursor: not-allowed;
        }
        .file-input {
            margin: 10px 0;
            color: #ffffff;
            display: block;
            width: 100%;
        }
        .file-input::-webkit-file-upload-button {
            background: #ffd700;
            color: #1a1a1a;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        #login-interface {
            display: none;
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #ffd700;
        }
        #prediction-interface {
            display: none;
            background: linear-gradient(145deg, #2b2b2b, #1f1f1f);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #ffd700;
        }
        .input-field {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ffd700;
            border-radius: 6px;
            font-size: 16px;
            background: #333333;
            color: #ffffff;
            box-sizing: border-box;
        }
        .input-field::placeholder {
            color: #cccccc;
        }
        .error {
            color: #ff4d4d;
            margin-top: 5px;
            display: none;
            font-size: 14px;
            text-align: center;
        }
        .result {
            margin-top: 20px;
            font-size: 18px;
            color: #ffd700;
            font-weight: bold;
            text-align: center;
        }
        @media (max-width: 480px) {
            .container {
                padding: 10px;
            }
            .column, #login-interface, #prediction-interface {
                padding: 15px;
            }
            .submit-btn {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="deposit-column" class="column active">
            <h2>Deposit Screenshot</h2>
            <input type="file" id="deposit-file" class="file-input" accept="image/*">
            <img id="deposit-preview" src="https://via.placeholder.com/300x200?text=Deposit+Screenshot" alt="Deposit Screenshot">
            <button id="deposit-btn" class="submit-btn" onclick="nextColumn('deposit-column', 'video-column')" disabled>Next</button>
        </div>
        <div id="video-column" class="column">
            <h2>Registration Process Video</h2>
            <input type="file" id="video-file" class="file-input" accept="video/*">
            <video id="video-preview" controls>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button id="video-btn" class="submit-btn" onclick="showLogin()" disabled>Submit</button>
        </div>
        <div id="login-interface">
            <h2>Login Interface</h2>
            <input type="text" id="login-code" class="input-field" placeholder="Enter Approval Code">
            <p id="login-error" class="error">Invalid approval code. Please try again.</p>
            <button class="submit-btn" onclick="checkLogin()">Submit</button>
        </div>
        <div id="prediction-interface">
            <h2>Big Daddy Game Wingo Prediction</h2>
            <input type="text" id="prediction-code" class="input-field" placeholder="Enter last 6 digits" maxlength="6">
            <p id="prediction-error" class="error">Please enter exactly 6 digits.</p>
            <button class="submit-btn" onclick="showPrediction()">Submit</button>
            <div id="prediction-result" class="result"></div>
        </div>
    </div>

    <script>
        // File input handlers for media preview and button enabling
        document.getElementById('deposit-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('deposit-preview').src = e.target.result;
                    document.getElementById('deposit-btn').disabled = false;
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('deposit-btn').disabled = true;
            }
        });

        document.getElementById('video-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const video = document.getElementById('video-preview');
                video.src = URL.createObjectURL(file);
                video.load();
                document.getElementById('video-btn').disabled = false;
            } else {
                document.getElementById('video-btn').disabled = true;
            }
        });

        function nextColumn(currentId, nextId) {
            document.getElementById(currentId).classList.remove('active');
            document.getElementById(nextId).classList.add('active');
        }

        function showLogin() {
            document.getElementById('video-column').style.display = 'none';
            document.getElementById('login-interface').style.display = 'block';
        }

        function checkLogin() {
            const code = document.getElementById('login-code').value;
            const error = document.getElementById('login-error');
            if (code === '448119588622') {
                error.style.display = 'none';
                document.getElementById('login-interface').style.display = 'none';
                document.getElementById('prediction-interface').style.display = 'block';
            } else {
                error.style.display = 'block';
            }
        }

        function showPrediction() {
            const code = document.getElementById('prediction-code').value;
            const error = document.getElementById('prediction-error');
            const result = document.getElementById('prediction-result');
            
            if (/^\d{6}$/.test(code)) {
                error.style.display = 'none';
                const prediction = Math.random() > 0.5 ? 'Big' : 'Small';
                result.textContent = `Prediction: ${prediction}`;
            } else {
                error.style.display = 'block';
                result.textContent = '';
            }
        }
    </script>
</body>
</html>
