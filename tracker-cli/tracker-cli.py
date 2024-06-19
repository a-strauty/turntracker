import serial.tools.list_ports

serialInst = serial.Serial()

serialInst.baudrate = 115200
serialInst.port = '/dev/ttyUSB0'
serialInst.open()

while True:
    receiver = input("Pick Receiver (1/2): ")
    command = "<asdf," + receiver + ",5>"
    serialInst.write(command.encode('utf-8'))

    if command == 'exit':
        exit()