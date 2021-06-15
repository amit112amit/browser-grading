import argparse
import base64


def printpngdata(pngfile, textwidth, outfile=None):
    """
    Encode a PNG file using base64 and print formatted output.
    """
    with open(pngfile, 'rb') as pfile:
        pngdata = pfile.read()

    pngstring = base64.b64encode(pngdata).decode()

    lines = []
    for i in range(0, len(pngstring), textwidth):
        line = pngstring[i : i + textwidth] + "\\\n"
        lines.append(line)

    lines[-1] = lines[-1].rstrip().rstrip("\\")

    if outfile:
        with open(outfile, 'w') as outfile:
            outfile.writelines(lines)
    else:
        for line in lines:
            print(line.rstrip())

if __name__ == "__main__":

    # Set up command line arguments
    parser = argparse.ArgumentParser(description='Encode a PNG file as a formatted base64 string.')
    parser.add_argument('pngfile', help="PNG file name")
    parser.add_argument('-o', '--output', dest='outfile', required=False, help='Name of the output file to be printed')
    parser.add_argument('-t', '--textwidth', dest='textwidth', required=False, default=79, type=int, help='Output width for formatting')

    # Process the command line arguments
    args = parser.parse_args()

    # Generate output
    printpngdata(args.pngfile, args.textwidth, args.outfile)


