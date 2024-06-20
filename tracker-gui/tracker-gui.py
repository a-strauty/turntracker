import PySimpleGUI as sg
import serial.tools.list_ports

serialInst = serial.Serial()

serialInst.baudrate = 115200
serialInst.port = '/dev/ttyUSB0'
serialInst.open()


def sort_and_process(pairs, process_function):
    # Sort the list of tuples based on the second item (value)
    sorted_pairs = sorted(pairs, key=lambda x: x[1], reverse=True)
    
    # Call the process function for each item in the sorted list
    for pair in sorted_pairs:
        process_function(pair)

# Example process function
def example_process_function(pair):
    key, value = pair
    print(f"Processing key: {key}, value: {value}")
    if key == "T1":
        receiver = "1"
    if key == "T2":
        receiver = "2"
    command = "<asdf," + receiver + ",5>"
    serialInst.write(command.encode('utf-8'))

layout = [  [sg.Text('Rolls:', size=(25,1), justification='center', font=("Verdana", "10", "bold"))],
            [sg.T('Tracker 1:', size=(10,1), justification='right'), sg.I(key='-T1-', do_not_clear=True)],
            [sg.T('Tracker 2:', size=(10,1), justification='right'), sg.I(key='-T2-', do_not_clear=True)],
            [sg.T(' '*8), sg.Button('Submit'), sg.Button('Next'), sg.Button('Stop')]
        ]

window = sg.Window('Turn Tracker', layout, font='Calibri 10', default_element_size=(25,1))

while True:             # Event Loop
    event, values = window.read()
    print(event, values)
    if event is None:
        break
    if event == 'Submit':
        trackers = [("T1", int(values['-T1-'])), ("T2", int(values['-T2-']))] 
        sort_and_process(trackers, example_process_function)
    else:
        window['-MESSAGE-'].Update('Not yet implemlented')