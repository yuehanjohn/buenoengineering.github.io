import React from 'react';
// eslint-disable-next-line import/no-cycle
import {IconProps} from '../Icons/Icons';

interface IconRebuilderState {
  width: number;
  textLength: number;
}

export type IconRebuilderProps = {
  initialViewBoxWidth: number;
  initialViewBoxHeight: number;
  aspectRatio: number;
  children(iconRebuildData: IRenderPropsFunc): React.ReactNode;
} & Partial<IconProps>;

interface IRenderPropsFunc {
  textRef: React.RefObject<SVGTextElement>;
  width: number;
  height: number;
  textLength: number;
}

export class IconRebuilder extends React.Component<IconRebuilderProps, IconRebuilderState> {
  private readonly textRef: React.RefObject<SVGTextElement>;

  constructor(props: IconRebuilderProps) {
    super(props);

    if (props.aspectRatio) {
      const newWidth = props.aspectRatio * props.initialViewBoxHeight;
      this.state = {
        textLength: newWidth - props.initialViewBoxWidth,
        width: newWidth,
      };
    } else {
      this.state = {
        textLength: 0,
        width: props.initialViewBoxWidth,
      };
    }

    this.textRef = React.createRef<SVGTextElement>();
  }

  public componentDidMount(): void {
    if (!this.props.aspectRatio) {
      this.build();
    }
  }

  public componentDidUpdate(prevProps: IconRebuilderProps): void {
    if (prevProps.text !== this.props.text) {
      this.build();
    }
  }

  private build() {
    const newTextLength = this.textRef.current!.getComputedTextLength();
    const newWidth = this.props.initialViewBoxWidth + newTextLength;
    this.setState({
      textLength: newTextLength,
      width: newWidth,
    });
  }

  public render(): React.ReactNode {
    return this.props.children({
      textRef: this.textRef,
      textLength: this.state.textLength,
      width: this.state.width,
      height: this.props.initialViewBoxHeight,
    });
  }
}
