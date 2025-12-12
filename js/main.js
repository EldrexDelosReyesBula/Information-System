        let data = []; //array

        function load() {
            let saved = localStorage.getItem("list");
            if (saved) {
                data = JSON.parse(saved); //convert string to object
            } else {
                data = [];
            }
            show();
        }

        function save() {
            localStorage.setItem("list", JSON.stringify(data)); //convert object to string
            show(); //update storage
        }
        //update student lists
        function show() {
            let list = document.getElementById("list");

            list.innerHTML = "";

            //empty state
            if (data.length === 0) {
                let box = document.createElement("div");
                box.className = "empty-message";

                let img = document.createElement("img");
                img.src = "../assets/empty.png";
                img.className = "empty-image";

                let msg1 = document.createElement("p");
                msg1.textContent = "Empty list… Did they run away?";

                let msg2 = document.createElement("p");
                msg2.textContent = "Hit 'Add' before they disappear!";

                box.appendChild(img);
                box.appendChild(msg1);
                box.appendChild(msg2);
                list.appendChild(box);
                return;
            }

            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                let div = document.createElement("div");
                div.className = "student-item";

                let info = document.createElement("div");
                info.className = "student-info";

                let h3 = document.createElement("h3");
                h3.textContent = item.name;

                let p = document.createElement("p");
                p.textContent = "Year: " + item.year + " | Section: " + item.section;

                info.appendChild(h3);
                info.appendChild(p);

                let actions = document.createElement("div");
                actions.className = "student-actions";

                let del = document.createElement("button");
                del.className = "delete-btn";
                del.textContent = "Delete";
                del.onclick = function() {
                    remove(i);
                };

                actions.appendChild(del);

                div.appendChild(info);
                div.appendChild(actions);

                list.appendChild(div);
            }
        }
        //display overlay form
        function showForm() {
            document.getElementById("overlay").style.display = "flex";
            document.getElementById("name").focus();
        }
        //hide overlay form (cancel or saved)
        function hideForm() {
            document.getElementById("overlay").style.display = "none";
            clear();
        }
        //reset all inputs in the form
        function clear() {
            document.getElementById("name").value = "";
            document.getElementById("year").value = "";
            document.getElementById("section").value = "";
        }
        //add new student to "data" array
        function add() {
            let n = document.getElementById("name").value.trim();
            let y = document.getElementById("year").value.trim();
            let s = document.getElementById("section").value.trim();

            if (n === "" || y === "" || s === "") {
                alert("Fill all");
                return;
            }

            let obj = {
                name: n,
                year: y,
                section: s
            };

            data.push(obj);
            alert("Added!");

            save();
            hideForm();
        }
        //delete students from the "data" array
        function remove(index) {
            let ok = confirm("Delete this?");

            if (ok) {
                data.splice(index, 1);
                save();
                alert("Deleted!");
            }
        }
        //initialize page 
        window.onload = function() {
            load(); //call load() to retrieve saved data and displat

            document.getElementById("addBtn").onclick = function() {
                clear();
                showForm();
            };

            document.getElementById("saveBtn").onclick = add;

            document.getElementById("cancelBtn").onclick = hideForm;
        };
